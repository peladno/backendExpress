const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const http = require("http");

//websocket
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const loginRouter = require("./src/routers/user");
const webRouter = require("./src/routers/web");

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server http on ${PORT}...`);
});
httpServer.on("error", (error) => console.log("Error on server", error));

//directories
app.use("/", express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "./public/views");

////////////////////////////////End config/////////////////////////////////////

//normalizr
const normalizr = require("./src/normalizacion/normalizacion");

//methods
const Container = require("./modules/products/productsMethods");
const messagesJson = new Container("./modules/messages/messages.json");
const productsJson = new Container("./modules/products/file.json");

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
  const normalizedMessages = normalizr.normalizedMessages(messages);
  socket.emit("messages", normalizedMessages);

  socket.on("new-message", async (data) => {
    messagesJson.save(data);
    const messages = await messagesJson.getAll();
    const normalizedMessages = normalizr.normalizedMessages(messages);
    io.sockets.emit("messages", normalizedMessages);
  });
});

//mongo-session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://xxx:xxx@coderhouseproject.zgltv4f.mongodb.net/?retryWrites=true&w=majority",
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    rolling: true
  })
);

//routes
app.use("", loginRouter);
app.use("", webRouter);
