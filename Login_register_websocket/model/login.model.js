const mongoose = require("mongoose");

const userModel = mongoose.model(
  "users",
  new mongoose.Schema({
    timestamp: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
);

module.exports = userModel;
