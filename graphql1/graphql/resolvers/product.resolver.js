//TODO hacer funciones (resolvers)
const FactoryDao = require("../../src/index");
const DAO = FactoryDao();

module.exports = class productsApi {
  constructor() {
    this.dao = DAO;
  }
  allProducts = async () => {
    const data = await this.dao.products.getAll;
    return data;
  };

  getProduct = async (id) => {
    const data = await this.dao.products.getByID(id);
    return data;
  };

  deleteProduct = async (id) => {
    const deleted = await this.dao.products.deleteById(id);
    return deleted;
  };

  saveProduct = async (data) => {
    const saved = await this.dao.products.save(data);
    return saved;
  };

  updateProducts = async (id, data) => {
    const updated = await this.dao.products.updateItems(id, data);
    return updated;
  };
};
