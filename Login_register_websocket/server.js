const express = require("express");
const session = require("express-session");
const http = require("http");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config");
const URL = config.mongoLocal.connection;

const app = express();
const httpServer = http.createServer(app);
const userRouter = require("./src/routers/user");

//websocket
const { Server } = require("socket.io");
const io = new Server(httpServer);

//server
const PORT = config.PORT;

httpServer.listen(PORT, () => {
  console.log(`Server http on ${PORT}...`);
});
httpServer.on("error", (error) => console.log("Error on server", error));

//mongo
const MongoStore = require('connect-mongo')
mongoose
  .connect(URL)
  .then(console.log("Base de datos Mongoose conectada"))
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

//directories
app.use("/", express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "./public/views");

//config
app.use(express.urlencoded({ extended: true }));

////////////////////////////////End config/////////////////////////////////////

//normalizr
const normalizr = require("./src/normalizacion/normalizacion");

//methods
const Container = require("./contenedores/productsFile");
const messagesJson = new Container("./DB/messages/messages.json");
const productsJson = new Container("./DB/products/file.json");

//websocket

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

//session
app.use(
  session({
    store: new MongoStore({
      mongoUrl: "mongodb://localhost:27017/sessions",
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1000000,
      secure: false,
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.get("/products", async (request, resolve) => {
  const products = await productsJson.getAll();
  resolve.render("productsList", { products });
});
app.use("", userRouter);
