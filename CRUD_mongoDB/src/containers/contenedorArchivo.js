const fs = require("fs");

class ContainerFile {
  constructor(filename) {
    this.filename = filename;
    this.data = [];

    try {
      this.read();
    } catch (error) {
      console.log("File doesnt exist");
      this.write();
    }
  }

  async write() {
    try {
      await fs.promises.writeFile(
        this.filename,
        JSON.stringify(this.data, null, 2)
      );
      return console.log("Data saved!");
    } catch (error) {
      console.log(error);
    }
  }

  async read() {
    try {
      const data = await fs.promises.readFile(this.filename);
      this.data = JSON.parse(data);
      console.log("Data loaded!");
    } catch (error) {
      console.log(error);
    }
  }

  getLastID() {
    const dataLength = this.data.length;
    if (dataLength < 1) return 0;
    return this.data[this.data.length - 1].id;
  }

  save(obj) {
    const date = new Date();
    const actualDate = date.toLocaleDateString();
    const actualTime = date.toLocaleTimeString();
    const id = this.getLastID();
    const object = {
      ...obj,
      id: id + 1,
      timeStamp: `${actualDate} ${actualTime}`,
    };
    this.data.push(object);
    this.write();
  }

  async getAll() {
    try {
      const content = await this.getAll();
      return content;
    } catch (error) {
      console.log(error);
    }
  }

  async getByID(id) {
    try {
      const content = await this.getAll();
      const contentById = content.find((i) => i.id === id);
      return contentById;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      const content = await this.getAll();
      const product = content.filter((i) => i.id !== id);
      await this.write(product);
    } catch (error) {
      console.log(error);
    }
  }

  deleteAll() {
    this.data = [];
    this.write();
  }

  async randomItems() {
    try {
      const content = await this.getAll();
      const shuffled = [...content].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 1);
    } catch (error) {
      console.log(error);
    }
  }

  async updateItems(product) {
    try {
      const content = await this.getAll();

      let indx = content.findIndex((item) => item.id === product.id);
      if (indx == -1) {
        return { error };
      } else {
        content[indx].name = product.name;
        content[indx].price = product.price;
        content[indx].description = product.description;
        content[indx].image_url = product.image_url;
        content[indx].code = product.code;
        content[indx].stock = product.stock;

        await this.write(content);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Cart methods

  createCart() {
    const actualDate = new Date().toLocaleDateString();
    const actualTime = new Date().toLocaleTimeString();
    const id = this.getLastID();
    const cart = {
      products: [],
      id: id + 1,
      timeStamp: `${actualDate} ${actualTime}`,
    };
    this.data.push(cart);
    this.write();
    return cart.id;
  }

  async editCart(obj, id) {
    try {
      const content = await this.getAll();
      const index = content.findIndex(idCart => idCart.id === id);
      content[index].products.push(obj);
      await this.write(content);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(idCart, idProd) {
    try {
      const content = await this.getAll();
      const contentById = content.find((i) => i.id === idCart);
      const indx = contentById.products.findIndex((i) => i.id === idProd);
      contentById.products.splice(indx, 1);
      await this.write(content);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ContainerFile;
