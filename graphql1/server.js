//TODO agregar graphql endpoint

const express = require("express");
const cors = require("cors");
const config = require("./config");
const GraphqlController = require("./graphql/graphqlController/graphql.controller");

const app = express();
const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server http on ${PORT}...`);
});
server.on("error", (error) => console.log("Error on server", error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/graphql", new GraphqlController());
