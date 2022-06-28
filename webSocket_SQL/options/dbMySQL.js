const knexMySQL = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'javito90',
        database: 'Mydatabase'
    }
}
const knex = require("knex")(knexMySQL);

knex.schema.hasTable("products")
.then((result) => {
  if (!result) {
    knex.schema.createTable("products", table => {
      table.increments("id", {
        primaryKey: true,
      });
      table.string("item").notNullable();
      table.integer("price").notNullable();
      table.string("url").notNullable();
    }).then(result => {
      console.log("Products table created");
    }).catch(error => {console.log(error)
    }).finally(() => {
      knex.destroy();
    });
  }
});

module.exports = knexMySQL;