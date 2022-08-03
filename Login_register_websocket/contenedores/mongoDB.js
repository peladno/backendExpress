const mongoose = require("mongoose");
const config = require("../config");
const URL = config.mongoLocal.connection;

mongoose
  .connect(URL)
  .then(console.log("Base de datos Mongoose conectada"))
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

class ContainerMongo {
  constructor(model) {
    this.model = model;
  }

  async save(obj) {
    try {
      const date = new Date();
      const actualDate = date.toLocaleDateString();
      const actualTime = date.toLocaleTimeString();
      const object = {
        ...obj,
        timeStamp: `${actualDate} ${actualTime}`,
      };
      const newProduct = new this.model(object);
      const Saved = await newProduct.save();
      if (newProduct.error) {
        return { error: newProduct.error };
      } else {
        return Saved;
      }
    } catch (err) {
      throw err;
    }
  }

  async getAll() {
    try {
      const searched = await this.model.find();
      return searched;
    } catch (err) {
      throw err;
    }
  }

  async getByID(username) {
    try {
      const search = await this.model.findOne({username});
      if (search = undefined) {
        return { error: "user not found" };
      } else {
        return search;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ContainerMongo;