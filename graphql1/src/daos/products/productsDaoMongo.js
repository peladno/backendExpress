const contenedorMongo = require('../../containers/contenedorMongoDB');
const productModel =require('../../../model/product.model');


class ProductsDaoMongo extends contenedorMongo {
  constructor() {
    super(productModel);
  }
}

module.exports = ProductsDaoMongo;