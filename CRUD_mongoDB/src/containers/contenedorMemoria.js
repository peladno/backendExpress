class ContenedorMemoria {
  constructor() {
    this.data = [];
  }

  getAll() {
    return this.data;
  }

  getByID(id) {
    const idNumber = Number(id);
    return this.data.find((i) => i.id === idNumber);
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
    return object;
  }

  deletebyId(id) {
    const content = this.data.findIndex((i) => i.id === id);
    this.data.splice(content, 1);
    return this.data;
  }

  deleteAll() {
    this.data = [];
  }

  updateItems(product) {
    const content = this.getAll();
    let indx = this.data.findIndex((i) => i.id === product.id);
    if (indx == -1) {
      return { error };
    } else {
      content[indx].name = product.name;
      content[indx].price = product.price;
      content[indx].description = product.description;
      content[indx].image_url = product.image_url;
      content[indx].code = product.code;
      content[indx].stock = product.stock;

      this.saveAll(content);
    }
  }

  //Cart methods

  editCart(obj, id) {
    const content = this.getAll();
    const index = content.findIndex((idCart) => idCart.id === id);
    content[index].products.push(obj);
  }

  deleteProduct(idCart, idProd) {
    const content = this.getAll();
    const contentById = content.find((i) => i.id === idCart);
    const indx = contentById.products.findIndex((i) => i.id === idProd);
    contentById.products.splice(indx, 1);
    this.saveAll(content);
  }
}

module.exports = ContenedorMemoria;