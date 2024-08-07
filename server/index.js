// server/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

client.connect().then(() => {
  db = client.db('rplace');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('drawPixel', async ({ x, y, color }) => {
    const pixel = { x, y, color, timestamp: new Date() };
    await db.collection('pixels').updateOne({ x, y }, { $set: pixel }, { upsert: true });
    io.emit('pixelUpdate', { x, y, color });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
