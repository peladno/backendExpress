//TODO controller graphql
const { graphqlHTTP } = require("express-graphql");
const schema = require("../graphqlModel/graphql.model");

const productsApi = require("../resolvers/product.resolver");
const cartApi = require("../resolvers/cart.resolver");

module.exports = class GraphqlController {
  constructor() {
    const ApiProducts = new productsApi();
    const ApiCart = new cartApi();
    return graphqlHTTP({
      schema: schema,
      rootValue: {
        saveProduct: ApiProducts.saveProduct,
        getProducts: ApiProducts.getProduct,
        deleteProducts: ApiProducts.deleteProduct,
        allProducts: ApiProducts.allProducts,
        updateProducts: ApiProducts.updateProducts,
        getCarts: ApiCart.getCarts,
        getCart: ApiCart.getCart,
        deleteCart: ApiCart.deleteCart,
        addProductToCart: ApiCart.addProductToCart,
        deleteProductFromCart: ApiCart.deleteProductFromCart,
      },
      graphiql: true,
    });
  }
};
