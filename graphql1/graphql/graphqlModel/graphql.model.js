const { buildSchema } = require("graphql");

const schema = buildSchema(`
  # Inputs product and cart
    input ProductInput {
        name: String,
        price: Float,
        description: String,
        image_url: String,
        code: String,
        stock: Float
    }
  
  # Types product and cart
    type Product {
        id: ID!,
        name: String,
        price: Float,
        description: String,
        image_url: String,
        code: String,
        stock: Float,
        timestamp: String
    }
  
    type Cart {
        id:ID!,
        products: [Product],
        timestamp: String

    }

  # Defino los type Query y Mutation
    type Query {
      allProducts(field: String, value: String):[Product],
      getProduct(id: ID!): Product,
      getCarts(field: String, value: String): [Cart],
      getCart:Cart
      
    }
    type Mutation {
      saveProduct(data: ProductInput): Product,
      updateProduct(id:ID!, data: ProductInput):Product,
      deleteProduct(id:ID!): Product,
      addProductToCart(id:ID!, data: ProductInput):Cart,
      deleteProductFromCart(id: ID!):Cart,
      deleteCart(id:ID!):Cart,
    }
  `);

module.exports = schema;
