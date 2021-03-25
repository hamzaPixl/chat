import express, { Express } from 'express';
import * as http from 'http';
import cors from 'cors';
import config from 'config';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookiesParser from 'cookie-parser';
import morgan from 'morgan';

import logger from '../lib/logger';

const port = config.get('port');
const host = config.get('host');

class HttpServer {
  public app: Express;
  public server: http.Server;

  constructor() {
    this.app = express();
    this.initServer();
    this.server = http.createServer(this.app);
  }

  initServer(): void {
    this.app.set('port', port);
    this.app.use(
      cors({
        origin: config.get('origins'),
        optionsSuccessStatus: 200,
      })
    );
    this.app.use(morgan('short'));
    this.app.use(cookiesParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  start(): void {
    this.server.listen(port, () => {
      logger.info(`Server started ${host}:${port}`);
    });
  }

  close(): void {
    this.server.close(() => {
      logger.info(`Server closed ${host}:${port}`);
    });
  }
}

export default HttpServer;
