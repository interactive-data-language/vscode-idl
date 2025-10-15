# IDL Process

This library manages starting and interacting directly with IDL in various ways.

It handles the logic of, say when you need to execute something, how that gets routed to the type of IDL running behind the scenes.

There's a wrapper around this in the IDL Interaction Manager class that handles execution queues and that is what is directly plugged into VSCode.
