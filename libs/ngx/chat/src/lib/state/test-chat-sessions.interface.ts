import { ChatSession } from '@idl/types/chat';
import { nanoid } from 'nanoid';

/**
 * Test chat data
 */
export const TEST_CHAT_SESSIONS: ChatSession[] = [
  {
    id: nanoid(),
    title: 'Welcome Chat',
    createdAt: new Date(),
    lastMessageAt: new Date(),
    messageCount: 3,
    status: 'ready',
    messages: [
      {
        id: nanoid(),
        type: 'user',
        content: [
          {
            type: 'text',
            payload:
              'Can you help me do XYZ? with some other really long text and blah blah blah blah blah thingajshdlfkjhaslkhdflkjashdflkj ksjhdflkhfas lashdflkj alkdsjhflkja lkajshdfk lkahdslkfha lkajhdslfkj alkdjhsflkjahs',
          },
        ],
      },
      {
        id: nanoid(),
        type: 'system',
        content: [
          {
            type: 'text',
            payload: 'Can you help me do XYZ?\n- Thing\n- Also',
          },
        ],
      },
      {
        id: nanoid(),
        type: 'user',
        content: [
          {
            type: 'text',
            payload: '[link](https://www.google.com)',
          },
        ],
      },
    ],
  },
  {
    id: nanoid(),
    title: 'Project Discussion',
    createdAt: new Date(Date.now() - 86400000),
    lastMessageAt: new Date(Date.now() - 3600000),
    messageCount: 15,
    status: 'in-progress',
    messages: [
      {
        id: nanoid(),
        type: 'user',
        content: [
          {
            type: 'text',
            payload: 'Can you help me do XYZ?',
          },
        ],
      },
      {
        id: nanoid(),
        type: 'system',
        content: [
          {
            type: 'text',
            payload: 'Can you help me do XYZ?',
          },
        ],
      },
    ],
  },
];
