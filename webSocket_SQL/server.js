const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server http on ${PORT}...`);
});
httpServer.on("error", (error) => console.log("Error on server", error));

app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/public"));

////////////////////////////////End config/////////////////////////////////////
const mySQL = require('./options/dbMySQL');
const SQLlite = require('./options/dbSQLlite');

const Container= require("./modules/products/productsMethods");

const messagesContainer = new Container(SQLlite, 'messages')
const productsContainer = new Container(mySQL, 'products');

app.get("/", async(request, resolve) => {
  const messages = await messagesContainer.getAll();
  resolve.render("index", { messages });
});

app.get('/products', async (request, resolve) => {
  const products = await productsContainer.getAll();
  resolve.render("productsList", { products })
})


io.on("connection", async (socket) => {
  //products
  const products = await productsContainer.getAll();
  socket.emit("show", products);
  socket.on("add", (data) => {
    productsContainer.save(data);
    io.sockets.emit("show", 'ok');
  });

  //messages
  const messages = await messagesContainer.getAll();
  socket.emit("messages", messages);
  socket.on("new-message", (data) => {
   messagesContainer.save(data);
    io.sockets.emit("messages", messages);
  });
});
