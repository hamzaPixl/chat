module.exports = {
  logLevel: 'info',
  title: 'chat',
  defaultTimezone: 'Europe/Brussels',
  port: process.env.PORT || 5000,
  host: process.env.HOST || '0.0.0.0',
  mongo: process.env.MONGO || 'mongodb://localhost:27017/chat',
};
