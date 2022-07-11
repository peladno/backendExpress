const contenedorMongo = require('../../containers/contenedorMongoDB');
const CartModel = require('../../../model/cart.model')

class CartDaoMongo extends contenedorMongo {
  constructor() {
    super(CartModel);
  }
}

module.exports = CartDaoMongo;