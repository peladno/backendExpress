module.exports = {
    PORT: process.env.PORT || 8080,
    mongoLocal: {
      client: 'mongodb',
      connection: 'mongodb://localhost:27017/users',
    },
  };
  