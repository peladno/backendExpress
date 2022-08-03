const mongoose = require("mongoose");

module.exports  = mongoose.model(
  "Users",
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


