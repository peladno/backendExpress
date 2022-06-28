const knexSQLlite = {
    client: 'sqlite3',
    connection: {
        filename: "./DB/ecommerce.sqlite"
    },
    useNullAsDefault: true
}

const knex = require("knex")(knexSQLlite);

knex.schema.hasTable("messages").then((result) => {
  if (!result) {
    knex.schema
      .createTable("messages", (table) => {
        table.increments("id", {
          primaryKey: true,
        });
        table.string("author").notNullable(),
          table.string("text").notNullable(),
          table.datetime("date"),
          table.datetime("time")
      })
      .then((result) => {
        console.log("Messages table created successfully.");
      })
      .finally(() => {
        knex.destroy();
      });
  }
});

module.exports = knexSQLlite;
