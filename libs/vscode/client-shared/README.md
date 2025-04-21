# Client: Shared

This is a collection of code that is shared between the normal extension client and the web extension client.

This reduces code duplication between the two.

Everything added to this library should work in node and web runtimes (i.e. don't add anything here specific to running IDL code because that won't work in browsers).
