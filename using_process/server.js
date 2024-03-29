const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const parseArgs = require("minimist");

//config server
const config = require("./config");
const {URL, URL2} = config.mongoLocal;
const http = require("http");
const app = express();
const httpServer = http.createServer(app);
const userRouter = require("./src/routers/user");
const webRouter = require("./src/routers/web");


//minimist
const options = { default: {PORT: '8080'}}
const args = parseArgs(process.argv.slice(2), options)
const PORT = args.PORT

//websocket
const { Server } = require("socket.io");
const io = new Server(httpServer);

//server

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
      mongoUrl: URL2,
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
app.use("", webRouter);
