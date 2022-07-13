const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const config = require("../../config");
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

  async getAll() {
    try {
      const searched = await this.model.find();
      return searched;
    } catch (err) {
      console.log(err);
    }
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

  async deleteById(id) {
    try {
      const deleted = await this.model.deleteOne({ _id: new ObjectId(id) });
      if (deleted.length === 0) {
        return { error: "product not found" };
      } else {
        return deleted;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll() {
    try {
      const deleted = await this.model.deleteMany({});
      if (deleted.length === 0) {
        return { error: "product not found" };
      } else {
        return deleted;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateItems(id, product) {
    const date = new Date();
    const newTime = date.toLocaleTimeString();
    const newDate = date.toLocaleDateString();
    const timestamp = `${newDate} ${newTime}`;
    try {
      const updated = await this.model.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        {
          $push: {
            name: product.name,
            price: product.price,
            description: product.description,
            image_url: product.image_url,
            code: product.code,
            stock: product.stock,
            timeStamp: timestamp,
          },
        }
      );
      return updated;
    } catch (err) {
      console.log(err);
    }
  }

  async createCart() {
    const actualDate = new Date().toLocaleDateString();
    const actualTime = new Date().toLocaleTimeString();
    try {
      const cart = new this.model({
        products: [],
        timeStamp: `${actualDate} ${actualTime}`,
      });
      const saved = await cart.save();
      if (cart.error) {
        return { error: cart.error };
      } else {
        return saved;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async editCart(obj, id) {
    try {
      const updated = await this.model.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { products: obj } },
        { new: true }
      );
      return updated;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(idCart, idProduct) {
    try {
      const updated = await this.model.updateOne(
        { _id: new ObjectId(idCart) },
        { $pull: { products: { _id: idProduct } } },
        { new: true }
      );
      return updated;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = ContainerMongo;
