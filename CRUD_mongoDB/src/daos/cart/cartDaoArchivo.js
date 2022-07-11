const contenedorArchivo = require('../../containers/contenedorArchivo');

class CartDaoArchivo extends contenedorArchivo {
  constructor() {
    super('../../../DB/cart.json');
  }
}

module.exports = CartDaoArchivo;