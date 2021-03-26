import HttpServer from './server/HttpServer';
import SocketServer from './server/SocketServer';
import db from './lib/mongo/db';
import logger from './lib/logger';

import { Message, User, Session } from './types';
import { getUniqueUsersOnlineByUsername } from './utilities';

import { MessagesController, UsersController, RoomsController } from './routes/http';

let messages: Message[] = [];
let users: User[] = [];
let activeUserSessions: Session[] = [];

const httpServer = new HttpServer();
const socketServer = new SocketServer(httpServer.server);

function handler(socket: any) {
  const { id } = socket.client;
  logger.info(`new client session: ${id}`);

  // =====================================================================================
  // New login
  // =====================================================================================

  socket.on('new login', (user: User) => {
    logger.info(`user connected: ${user.username}`);

    // Add the new login to the list of all users
    if (!users.some((existingUser) => existingUser.username === user.username)) {
      users = [...users, user];
      socketServer.io.emit('new user added', user);
    }

    // Save the current username/session combination
    socket.sessionUsername = user.username;
    activeUserSessions.push({
      session: id,
      username: user.username,
    });

    socketServer.io.emit('users online', getUniqueUsersOnlineByUsername(activeUserSessions));
  });

  // =====================================================================================
  // Send Message
  // =====================================================================================

  socket.on('send message', (message: Message) => {
    logger.info(`message: ${message.author}: ${message.content}`);

    messages.push(message);

    socketServer.io.emit('receive message', message);
  });

  // =====================================================================================
  // Disconnect
  // =====================================================================================

  socket.on('disconnect', () => {
    logger.info(`user disconnected: ${socket.sessionUsername}`);
    // Remove the current session
    // The same user may have multiple client sessions open so this prevents incorrect display
    activeUserSessions = activeUserSessions.filter(
      (user) => !(user.username === socket.sessionUsername && user.session === id)
    );

    socketServer.io.emit('users online', getUniqueUsersOnlineByUsername(activeUserSessions));
  });
}

db.connect().then(() => {
  httpServer.app.use('/api/messages', MessagesController);
  httpServer.app.use('/api/rooms', RoomsController);
  httpServer.app.use('/api/users', UsersController);
  httpServer.start();
  socketServer.addHandler('connection', handler);
});
