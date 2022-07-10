const mongoose = require("mongoose");
const config = require("../../config");
const URL = config.mongoLocal.connectionString;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

class ContainerMongo {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    try {
        const searched = await this.model.find();
      return searched
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
      const search = await this.model.find({ _id: { $eq: id } });
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
      const deleted = await this.model.deleteOne({ _id: { $eq: id } });
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

  async updateItems(product) {
    try {
      const searched = await this.model.find({ _id: { $eq: product._id } });
      if (searched.count() === 0) {
        return { error: "product not found" };
      } else {
        await searched.updateOne(
          { _id: { $eq: product._id } },
          {
            $set: {
              name: product.name,
              price: product.price,
              description: product.description,
              image_url: product.image_url,
              code: product.code,
              stock: product.stock,
            },
          }
        );
        return { message: `product ${searched} updated` };
      }
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
      const searched = await this.model.find({ _id: { $eq: id } });
      if (searched.count() === 0) {
        return { error: "cart not found" };
      } else {
        await searched.updateOne(
          { _id: { $eq: id } },
          {
            $push: {
              products: obj,
            },
          }
        );
        return { message: `cart ${searched} updated` };
      }
    } catch {}
  }

  /*async editCart(obj, id) {
    try {
        this.model.findOneAndUpdate({ _id: { $eq: id } }, { $push: { products: obj } });
      } catch(err) {
        console.log(err);
      }
    }*/

    async deleteProduct(idCart, idProduct) {
        try {
            const searched = await this.model.find({ _id: { $eq: idCart } });
            if (searched.count() === 0) {
                return { error: "cart not found" };
            } else {
                const searchProduct = await searched.findOneAndDelete(idProduct);
                if (searchProduct.count === 0) {
                    return { error: "product not found" };
                } else {
                    return { message: `product ${searchProduct} deleted` };
                }
            }
        } catch {

        }
    }
}

module.exports = ContainerMongo;
