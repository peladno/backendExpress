const fs = require("fs");

class Container {
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
    const object = {...obj, id: id+1, timeStamp: `${actualDate} ${actualTime}`}
    this.data.push(object);
    this.write();
  }

  async getByID(id) {
    try {
      const allContent = await fs.promises.readFile(this.filename, "utf-8");
      const content = JSON.parse(allContent);
      const contentById = content.find((i) => i.id == id);
      return contentById;
    } catch (error) {
      console.log(error);
    }
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

  async deleteById(id) {
    try {
      const allContent = await fs.promises.readFile(this.filename, "utf-8");
      const content = JSON.parse(allContent);
      const product = content.filter((i) => i.id !== id);
      await fs.promises.writeFile(
        this.filename,
        JSON.stringify(product, null, 2)
      );
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
      const allContent = await fs.promises.readFile(this.filename, "utf-8");
      const content = JSON.parse(allContent);
      const shuffled = [...content].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 1);
    } catch (error) {
      console.log(error);
    }
  }

  async updateItems(product) {
    try {
      const allContent = await fs.promises.readFile(this.filename, "utf-8");
      const content = JSON.parse(allContent);

      let indx = content.findIndex((item) => item.id === product.id);
      if (indx == -1) {
        return { error };
      } else {
        content[indx].name = product.name;
        content[indx].price = product.price;
        content[indx].description = product.description;
        content[indx].url = product.url;
        content[indx].code = product.code;
        content[indx].stock = product.stock;

        await fs.promises.writeFile(
          this.filename,
          JSON.stringify(content, null, 2)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Container;
