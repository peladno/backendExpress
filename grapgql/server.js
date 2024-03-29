const express = require("express");
const cors = require("cors");
const config = require("./config");

const app = express();
const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server http on ${PORT}...`);
});
server.on("error", (error) => console.log("Error on server", error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (request, resolve) => {
  resolve.send("<h1>Eccommerce</h1>");
});
