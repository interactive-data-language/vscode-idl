import cors from 'cors';
import express from 'express';

import { validateEnv } from './config/env.config';
import { createChatRoutes } from './routes/chat.routes';
import { ChatService } from './services/chat.service';

// Validate environment variables
const env = validateEnv();

const host = env.HOST;
const port = Number(env.PORT);

const app = express();

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins in development (proxy handles this)
    credentials: true,
  }),
);
app.use(express.json());

// Initialize services
const chatService = new ChatService(env.OPENAI_API_KEY);

// Routes
app.get('/', (_req, res) => {
  res.send({ message: 'Agents API Server' });
});

app.use('/api/chat', createChatRoutes(chatService));

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
  console.log(`[ info ] API endpoints:`);
  console.log(`         - GET  /api/chat/models`);
  console.log(`         - POST /api/chat/message`);
});
