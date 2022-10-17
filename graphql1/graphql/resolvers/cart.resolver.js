//TODO hacer funciones (resolvers)

const FactoryDao = require("../../src/index");
const DAO = FactoryDao();

module.exports = class cartApi {
  constructor() {
    this.dao = DAO;
  }

  getCarts = async () => {
    const data = await this.dao.cart.getAll();
    return data;
  };

  saveCart = async () => {
    const saved = await this.dao.cart.createCartthis.dao;
    return saved;
  };

  deleteCart = async (id) => {
    const deleted = await this.dao.cart.deleteById(id);
    return deleted;
  };

  getCart = async (id) => {
    const data = await this.dao.cart.getByID(id);
    return data;
  };

  addProductToCart = async (id, newData) => {
    const data = await this.dao.cart.editCart(newData, id);
    return data;
  };

  deleteProductFromCart = async (prodID, idCart) => {
    const deleteProduct = await this.dao.cart.deleteProduct(prodID, idCart);
    return deleteProduct;
  };
};
