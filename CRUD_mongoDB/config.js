module.export = {
  PORT: process.env.PORT || 8080,
  mongoLocal: {
    client: 'mongodb',
    connection: 'mongodb://127.0.0.1:27017/ecommerce',
  },
};
