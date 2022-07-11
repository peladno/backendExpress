const CartDaoArchivo = require("./daos/cart/cartDaoArchivo");
const CartDaoMemoria = require("./daos/cart/cartDaoMemoria");
const CartDaoMongo = require("./daos/cart/cartDaoMongo");
const ProductsDaoMemoria = require("./daos/products/productsDaoMemoria");
const ProductsDaoMongo = require("./daos/products/productsDaoMongo");
const ProductsDaoArchivo = require("./daos/products/productsDaoArchivo");

const FactoryDao = () => {
  const typeDB = process.env.typeDB;
  
  if (typeDB == 'memory') {
    console.log("FactoryDao: typeDB: memory");
    return {
      cart: new CartDaoMemoria(),
      products: new ProductsDaoMemoria(),
    };
  } else if (typeDB == 'mongo') {
    console.log("FactoryDao: typeDB: mongo");
    return {
      cart: new CartDaoMongo(),
      products: new ProductsDaoMongo(),
    };
  } else if (typeDB == 'file') {
    console.log("FactoryDao: typeDB: file")
    return {
      cart: new CartDaoArchivo(),
      products: new ProductsDaoArchivo(),
    };
  }

  throw new Error("FactoryDao: typeDB: not found");
};

module.exports = FactoryDao;
