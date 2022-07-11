const contenedorArchivo = require('../../containers/contenedorArchivo');

class ProductsDaoArchivo extends contenedorArchivo {
  constructor() {
    super('../../../DB/products.json');
  }
}

module.exports = ProductsDaoArchivo;