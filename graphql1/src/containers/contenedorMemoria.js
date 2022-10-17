class ContenedorMemoria {
  constructor() {
    this.data = [];
  }

  getAll() {
    return this.data;
  }

  getByID(id) {
    return this.data.find((i) => i.id === Number(id));
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
    const content = this.data.findIndex((i) => i.id === Number(id));
    this.data.splice(content, 1);
    return this.data;
  }

  deleteAll() {
    this.data = [];
  }

  updateItems(id, product) {
    const content = this.getAll();
    let indx = this.data.findIndex((i) => i.id === Number(id));
    if (indx == -1) {
      return { error: "Product no found" };
    } else {
      content[indx].name = product.name;
      content[indx].price = product.price;
      content[indx].description = product.description;
      content[indx].image_url = product.image_url;
      content[indx].code = product.code;
      content[indx].stock = product.stock;

      return content;
    }
  }

  //Cart methods

  editCart(obj, id) {
    const content = this.getAll();
    const index = content.findIndex((idCart) => idCart.id === Number(id));
    return content[index].products.push(obj);
  }

  deleteProduct(idCart, idProd) {
    const content = this.getAll();
    const contentById = content.find((i) => i.id === Number(idCart));
    const indx = contentById.products.findIndex((i) => i.id === Number(idProd));
    return contentById.products.splice(indx, 1);
  }
}

module.exports = ContenedorMemoria;