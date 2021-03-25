import mongoose from 'mongoose'
import config from 'config'

import logger from './logger';

class Db {
  constructor() {
    mongoose.Promise = Promise;

    mongoose.connection.on('connected', () => {
      logger.info('Database Connection Established');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Database Connection Reestablished');
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('Database Connection Disconnected');
    });

    mongoose.connection.on('close', () => {
      logger.info('Database Connection Closed');
    });

    mongoose.connection.on('error', (error) => {
      logger.info(`Database ERROR: ${error}`);
    });
  }

  async connect() {
    await mongoose.connect(config.get('mongo'), {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  };

  async close() {
    await mongoose.disconnect();
  };
}

export default new Db();
