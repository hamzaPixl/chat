import * as http from 'http';
import * as socketio from 'socket.io';
import config from 'config';

import logger from '../lib/logger';

class SocketServer {
  public io: socketio.Server;

  constructor(httpServer: http.Server) {
    this.io = new socketio.Server(httpServer, {
      cors: {
        origin: config.get('origins'),
        credentials: true,
      },
    });
  }

  addHandler(topic: string, listener: (...args: any[]) => void) {
    if (this.io) {
      logger.info(`Add handler for topic ${topic}`);
      this.io.on(topic, listener);
    }
  }
}

export default SocketServer;
