import * as socketio from 'socket.io';
import * as http from 'http';
import * as express from 'express';
import {ChatEvents} from './constants';
import {getCurrentUser, userJoin} from './users';
import {formatMessage} from './message';

const app = express();

// Initialize HTTP server
const httpServer = http.createServer(app);

// Initialize SocketIO server instance
const io = new socketio.Server(httpServer);

// On socket connection
io.on(ChatEvents.CONNECT, (socket: socketio.Socket) => {
  console.log(`New WS Connection... ${socket.id}`);

  socket.on(ChatEvents.JOIN_ROOM, ({room}) => {
    // Register user
    const user = userJoin(socket.id, socket.id.substring(0, 3), room);

    // Add user to the room
    socket.join(room);

    // Welcome current user
    socket.emit(
      ChatEvents.MESSAGE,
      formatMessage('server', 'Welcome to the chat')
    );

    // Broadcast when a user connects
    // To all users except for connecting user
    socket.broadcast
      .to(user.room)
      .emit(
        ChatEvents.MESSAGE,
        formatMessage('server', `${user.name} has joined the chat.`)
      );
  });

  // Listen for chat message
  socket.on(ChatEvents.MESSAGE, text => {
    console.log(text);
    const user = getCurrentUser(socket.id);
    if (user === undefined) {
      return;
    }

    io.to(user.room).emit(ChatEvents.MESSAGE, formatMessage(user.name, text));
  });

  // Runs when client disconnects
  socket.on(ChatEvents.DISCONNECT, () => {
    const user = getCurrentUser(socket.id);
    if (user === undefined) {
      console.log(`no user found with id ${socket.id}`);
      return;
    }

    io.to(user.room).emit(
      ChatEvents.MESSAGE,
      formatMessage('server', `${user.name} has left the chat.`)
    );
  });
});

const PORT = 8080 || process.env.PORT;
httpServer.listen(PORT, () =>
  console.log(`listening on http://localhost:${PORT}`)
);
