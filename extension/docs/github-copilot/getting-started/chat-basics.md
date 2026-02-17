# Chat Basics

::: info

- Make sure your chat is in agent mode, as indicated by the hexagon icon next to the model type

- The model we recommend is Claude Sonnet 4.5 which was used for testing and development of the extension

- You can see the tools available to the LLM via MCP, including what MCP tools IDL for VSCode provides

:::

## Creating a New Chat

In the middle of the header bar in VSCode, you'll find a chat icon that will allow you to view past chats and create new ones.

![Accessing chat in VSCode](/assets/new-chat.png)

There's some key parts of chat to call out:

- The mode for the chat. Agent is the hexagon-like icon. You **must** be using this to have access to ENVI and IDL or for the LLM to take actions on your behalf.

- The model that you are using. For all testing and extension development, we used Claude Sonnet 4.5 and it is recommended for our model.

## Viewing Tools

After you are in a chat, and in agent mode, you can also explore the MCP tools that are available for the model to use.

In addition to seeing what tools are available, this let's you know that GitHub Copilot can properly see the tools we provide in the extension. If you don't see anything in the list, then that means there was likely a problem

![List of available tools for the LLM](/assets/tool-list.png)

## Approving Tool Execution

When you ask an LLM a question, you may have to approve certain actions to be taken. Any time an LLM tries to run a tool in Agent Mode, you can approve/deny the tool.

For common tools, such as searching docs, we recommend always approving so you don't have to keep saying yes.

Use your own judgement for what tools you are comfortable with the LLM running automatically for you. To help you make this decision, you can always see the inputs and outputs from a tool to give you insights into how it is used and whether you are comfortable with it running automatically.
