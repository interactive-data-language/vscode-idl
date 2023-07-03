# Worker Threads

This document covers the design for multi-threading.

## Old Way

Originally, we had an un-optimized approach for parsing code. It was built around a centralized data store with the parsing work being done in worker threads.

The basic logic was:

1. When the language server starts, or we get an update to IDL's path, then we trigger a workspace index.

2. We search for files in the workspace

3. Round-robin send only parsing requests to a pool of worker threads

4. For each file, we parse (tokenize and build the syntax tree) then send the syntax tree back to the main thread

5. The main thread stored the syntax tree for the file and tracked global tokens for the same file.

6. Once all parsing was finished, we perform type detection and secondary static analysis to find additional errors in code. This happened in the main thread because we need to know all of the globals for IDL in order to do type detection (i.e. we need structures, classes, etc) and those have no "import" pattern like JS/TS.

7. Synchronize all problems we find to the VSCode client.

### Problems

As the type detection and advanced problem detection increased in complexity, we really slowed down our processing time because we were using a single thread.

Not only this, but our post-processing was taking ~2x longer than parsing, which was really slowing down the overall process.

Additionally, a large slowdown (~50% of processing time) is the CPU encoding and decoding the heavy messages with our syntax trees.

## New Way: Part 1

To reduce some of the computational complexity, we analyzed the slowest-running routine calls with the node profiler.

It turned out that we had two bottlenecks:

1. Finding global tokens was non-linear. As your code base grew, so would the time it took to find a global token.

To resolve this, we added an additional level of depth to the data store which follows global type (i.e. function) => name (i.e. "plot") => matching tokens (i.e. all definitions for "plot"). Before it was just global type (i.e. function) => name (i.e. "plot") which required a for-loop and a search to find matches.

Fixing this gave us a 50% performance boost

2. Because validating type meant accessing expensive information to determine, we added a cache that would store specific things (i.e. the matching global routine for calling a procedure).

This also gave us a 50% performance boost and helps ensure future scalability as other checks are performed.

With these changes, we were able to double the performance of parsing code and applying post-processing, but we still have a single-threaded problem.

## New Way: Part 2

In order to add multi-threading to truly scale post-processing, we had to add some complexity to our application. This is because post-processing requires the full global context of IDL.

With this in mind, we went into optimization mode for the server.

Below, X corresponds to the number of worker threads (CPUs/2 with a max of 6).

The new process for init follows:

1. On startup, wait until we have an "on initialized" response with our workspaces that are open **and** the settings for VSCOde (IDL's path)

2. Once we have both pieces of information, we then find all the folders (and the search recursion level) that we need to apply.

3. We split the files into X evenly-sized buckets (i.e. make sure each thread has the same byte volume of data to process)

4. Send a single message to each worker to parse the files and send back the global tokens by file.

5. Once all workers have finished, we synchronize the global tokens between the workers

6. Send a single message to each worker to post-process the file and send back problems

7. Synchronize all problems to the VSCode client.

### Problems

Unfortunately, this wonderful plan didn't pan out nearly as expected. There's a bottleneck with sending messages to worker threads that was preventing our optimizations from having the full effect they should have (i.e. we removed all performance barriers and did not get the expected 2 \* X speedup that we thought we would).

After poking around, it was discovered that manually serializing and deserializing messages between worker threads (instead of sending native objects) removed our performance barrier and now scaling is almost linear.

## New Way: To Do

There are probably some edge cases not captured in teh current behavior.

Specifically, there will need to be some improvements regarding:

1. Updating IDL's search path after we have started (auto complete was weird about this). Stubbed out some code that would post-process all files in all threads on a workspace index to try and account for this.
