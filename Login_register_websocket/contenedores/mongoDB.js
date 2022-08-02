const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const config = require("./config");
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
  }

  async getAll() {
    try {
      const searched = await this.model.find();
      return searched;
    } catch (err) {
      console.log(err);
    }
  }

  async getByID(id) {
    try {
      const search = await this.model.find({ _id: new ObjectId(id) });
      if (search.length === 0) {
        return { error: "product not found" };
      } else {
        return search;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
