const fs = require("fs");

class cartContainer {
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
    const actualDate = new Date().toLocaleDateString();
    const actualTime = new Date().toLocaleTimeString();
    const id = this.getLastID();
    const object = {
      products: obj,
      id: id + 1,
      timeStamp: `${actualDate} ${actualTime}`,
    };
    this.data.push(object);
    this.write();
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
}

module.exports = cartContainer;
