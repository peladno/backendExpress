const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

mongoose
  .connect("mongodb://localhost/ecommerce")
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
    await newProduct.save();
    if (newProduct.error) {
      return { error: newProduct.error };
    }
  }

  async getByID(id) {
    try {
      const search = await this.model.find({ _id: new ObjectId(id) });
      if (search.count === 0) {
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
      if (deleted.count === 0) {
        return { error: "product not found" };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll() {
    try {
      await this.model.deleteMany({});
      return { message: "all products deleted" };
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
      await this.model.findByIdAndUpdate(
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
      await cart.save();
      if (cart.error) {
        return { error: cart.error };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async editCart(obj, id) {
    try {
      await this.model.updateOne(
        { _id: new ObjectId(id) },
        [{ $set: { "products": obj }} ]
      );
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(idCart, idProduct) {
    try {
      const searched = await this.model.find({ _id: new ObjectId(idCart) });

      await this.findByIdAndDelete({
        _id: new ObjectId(idProduct),
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = ContainerMongo;
