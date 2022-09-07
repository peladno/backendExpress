require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8080,
  PASS2: process.env.PASS2,
  mongoLocal: {
    client: "mongodb",
    URL: `mongodb+srv://peladno:${process.env.PASS}@coderhouseproject.zgltv4f.mongodb.net/?retryWrites=true&w=majority`,
    URL2: `mongodb://localhost:${process.env.PORT_MONGO}/sessions`
  },
};
