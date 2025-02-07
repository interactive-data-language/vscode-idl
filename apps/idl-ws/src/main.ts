import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

type Message = {
  user: string;
  text: string;
};

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data: Message) => {
    console.log('Received message:', data);
    io.emit('message', data); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
