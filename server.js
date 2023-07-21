const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Redis = require('ioredis');


const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
    console.log(__dirname)
})

const url = process.env.REDIS_CONNECTION_URL
const redisClient = new Redis(url); 

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});
// Socket.IO connection event
// io.on('connection', (socket) => {
//   console.log('A user connected.');

//   // Send existing messages from Redis to the client
//   redisClient.lrange('messages', 0, -1, (err, messages) => {
//     if (err) {
//       console.error('Error fetching messages from Redis:', err);
//       return;
//     }
//     messages.reverse().forEach((message) => {
//       const msg = JSON.parse(message);
//       socket.emit('message', msg);
//     });
//   });

//   // Receive new message from the client and save it to Redis
//   socket.on('message', (msg) => {
//     redisClient.lpush('messages', JSON.stringify(msg), (err) => {
//       if (err) {
//         console.error('Error saving message to Redis:', err);
//         return;
//       }
//       console.log('Message saved to Redis:', msg);
//       io.emit('message', msg); // Broadcast the message to all connected clients
//     });
//   });
io.on('connection', (socket) => {
  console.log('A user connected.');


  redisClient.lrange('messages', 0, -1, (err, messages) => {
    if (err) {
      console.error('Error fetching messages from Redis:', err);
      return;
    }
    messages.reverse().forEach((message) => {
      const msg = JSON.parse(message);
      socket.emit('message', msg);
    });
  });

 
  socket.on('message', (msg) => {
    redisClient.lpush('messages', JSON.stringify(msg), (err) => {
      if (err) {
        console.error('Error saving message to Redis:', err);
        return;
      }
      console.log('Message saved to Redis:', msg);
      io.emit('message', msg); 
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

