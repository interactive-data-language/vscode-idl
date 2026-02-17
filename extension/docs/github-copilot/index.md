# GitHub Copilot Integration

::: tip
Any GitHub Copilot integration, or AI-enabled tools, are opt-in and are not required to use IDL for VSCode.

You are not forced to use these capabilities and they are intended for users who are using GitHub Copilot or are interested in giving it a try.
:::

IDL for VSCode now includes native support and integration with GitHub Copilot through the use of MCP (Model Context Protocol).

- Requires IDL 9.2 and ENVI 6.2

- ENVI's LLM-enabled capabilities requires an additional license feature

This integration is focused around two key concepts:

1. Enable LLMs to better write and understand IDL code. This is done by configuring root instructions for any IDL code that GitHub Copilot automatically picks up

2. Specialized tools for being able to talk to and run ENVI to emulate how the experts use ENVI to solve remote sensing problems.

## Introduction: IDL Agent and ENVI Agent

Conceptually, we separate out our GitHub Copilot integration by IDL and by ENVI. Here's a short description of each:

| IDL Agent                                                                                                                                  | ENVI Agent                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| A set of instructions and MCP tools to allow GitHub Copilot to write better IDL code, interact with IDL, and understand your IDL routines. | A set of MCP tools dedicated for enabling GitHub Copilot to run ENVI and solve remote sensing problems. Can also access IDL Agent. |

## GitHub Copilot and Model Context Protocol

Our integration with GitHub Copilot is based on a set of what are called MCP Tools. MCP stands for Model Context Protocol and can be loosely thought of as a standardized interface that allows LLMs to run tools and interact with software on behalf of users.

## IDL for VSCode and MCP

To enable GitHub Copilot to run ENVI and IDL, IDL for VSCode now includes an MCP server as part of it. The MCP server is automatically configured and started so you don't need to do anything extra to take advantage of the integration.

Here are some key details to know about our implementation of MCP:

1. The MCP server starts automatically when the IDL for VSCode extension loads

2. Each VSCode window get's a dedicated MCP server

3. The MCP server can _only_ be accessed from your local machine (requests not originating from your machine are blocked)

## Software and Licensing Requirements

You'll need to be on IDL 9.2 and ENVI 6.2 in order to use the native integration with GitHub Copilot. The reason for this is we use the IDL Machine, which was released with IDL 9.2, to run IDL and ENVI.

The IDL integration is included with your maintenance and the ENVI integration requires the ENVI Agent license feature.

The ENVI Agent capabilities require a module because we have a specialized implementation of tools that optimize the thought-process and increase repeatability of how LLMs solve problems related to remote sensing.
