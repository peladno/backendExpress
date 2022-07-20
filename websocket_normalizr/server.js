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

//normazizr

const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const util = require('util')

const schemaAuthor = new schema.Entity(
  "author",
  {},
  {
    idAttribute: "mail",
  }
);

const schemaMessages = new schema.Entity(
  "messages",
  {
    author: schemaAuthor,
  },
  {
    idAttribute: "id",
  }
);

const schemaAllMessages = new schema.Entity(
  "allMessages",
  {
    messages: [schemaMessages],
  },
  {
    idAttribute: "id",
  }
);
const Container = require("./modules/products/productsMethods");
const messagesJson = new Container("./modules/messages/messages.json");
const productsJson = new Container("./modules/products/file.json");


app.get("/", async (request, resolve) => {
  const messages = await messagesJson.getAll();
  resolve.render("index", { messages });
});

app.get("/products", async (request, resolve) => {
  const products = await productsJson.getAll();
  resolve.render("productsList", { products });
});

io.on("connection", async (socket) => {
  //products
  const products = await productsJson.getAll();
  socket.emit("show", products);
  socket.on("add", (data) => {
    productsJson.save(data);
    io.sockets.emit("show", "ok");
  });

  //messages
  const messages = await messagesJson.getAll();
  const normalizedMessages = normalize(messages, [schemaAllMessages]);
  socket.emit("messages", normalizedMessages);

  function print(obj) {
    console.log(util.inspect(obj, false, 12, true));
  }
  socket.on("new-message", async (data) => {
    messagesJson.save(data);
    const messages = await messagesJson.getAll();
    const normalizedMessages = normalize(messages, [schemaAllMessages]);
    io.sockets.emit("messages", normalizedMessages);

    print(normalizedMessages);
  });
});
