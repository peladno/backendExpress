require("dotenv").config();

module.exports = {
  mongoLocal: {
    client: "mongodb",
    URL: `mongodb://localhost:${process.env.PORT_MONGO}/usersDB`,
    URL2: `mongodb://localhost:${process.env.PORT_MONGO}/sessions`
  },
};
