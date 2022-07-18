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
    return object;
  }

  async getAll() {
    try {
      const allContent = await fs.promises.readFile(this.filename, "utf-8");
      const content = JSON.parse(allContent);
      return content;
    } catch (error) {
      console.log(error);
    }
  }

  async getByID(id) {
    try {
      const content = await this.getAll();
      const contentById = content.find((i) => i.id === Number(id));
      return contentById;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      const content = await this.getAll();
      const product = content.filter((i) => i.id !== Number(id));
      fs.promises.writeFile(this.filename, JSON.stringify(product, null, 2));
    } catch (error) {
      console.log(error);
    }
  }

  deleteAll() {
    this.data = [];
    this.write();
  }

  async updateItems(id, product) {
    try {
      const content = await this.getAll();

      let indx = content.findIndex((item) => item.id === Number(id));
      if (indx == -1) {
        return { error: "Product no found" };
      } else {
        content[indx].name = product.name;
        content[indx].price = product.price;
        content[indx].description = product.description;
        content[indx].image_url = product.image_url;
        content[indx].code = product.code;
        content[indx].stock = product.stock;
        await fs.promises.writeFile(
          this.filename,
          JSON.stringify(content, null, 2)
        );
        return content;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Cart methods

  async createCart() {
    const actualDate = new Date().toLocaleDateString();
    const actualTime = new Date().toLocaleTimeString();
    const id = this.getLastID();
    const cart = {
      products: [],
      id: id + 1,
      timeStamp: `${actualDate} ${actualTime}`,
    };
    this.data.push(cart);
    await this.write();
    return cart.id;
  }

  async editCart(obj, id) {
    try {
      const content = await this.getAll();
      const index = content.findIndex((idCart) => idCart.id === Number(id));
      content[index].products.push(obj);
      await fs.promises.writeFile(
        this.filename,
        JSON.stringify(content, null, 2)
      );
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(idCart, idProd) {
    try {
      const content = await this.getAll();
      const contentById = content.find((i) => i.id === Number(idCart));
      const indx = contentById.products.findIndex(
        (i) => i.id === Number(idProd)
      );
      contentById.products.splice(indx, 1);
      await fs.promises.writeFile(
        this.filename,
        JSON.stringify(content, null, 2)
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ContainerFile;
