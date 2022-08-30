const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const parseArgs = require("minimist");
const cluster = require("cluster");

//numero de cpus
const numCPUs = require("os").cpus().length;

//config server
const config = require("./src/utils/config");
const { URL, URL2 } = config.mongoLocal;
const http = require("http");
const app = express();
const httpServer = http.createServer(app);
const userRouter = require("./src/routers/user");
const webRouter = require("./src/routers/web");
const { ruteNotFound } = require("./src/utils/middlewares");
const logger = require("./src/logger/logger");

//minimist
const options = { default: { PORT: "8080", mode: "FORK" } };
const args = parseArgs(process.argv.slice(2), options);
const PORT = args.PORT;
const mode = args.mode.toUpperCase();

//websocket
const { Server } = require("socket.io");
const io = new Server(httpServer);

//server

httpServer.listen(PORT, () => {
  console.log(`Server http on ${PORT}...`);
});
httpServer.on("error", (error) => console.log("Error on server", error));

//mongo
const MongoStore = require("connect-mongo");
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

//logger 
app.use((req,res, next) => {
	logger.info(`Ruta: ${req.path}, Método: ${req.method}`)
	next()
})

//routes
app.get("/products", async (request, resolve) => {
  const products = await productsJson.getAll();
  resolve.render("productsList", { products });
});
app.use("", userRouter);
app.use("", webRouter);
app.use(ruteNotFound);

if (mode === "CLUSTER") {
  //Cluster mode
  if (cluster.isMaster) {
    console.log(`Número de CPU: ${numCPUs}`);
    console.log(`PID MASTER ${process.pid}`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(
        "Worker",
        worker.process.pid,
        "died",
        new Date().toLocaleString()
      );
      cluster.fork();
    });
  } else {
    const connectedServer = httpServer.listen(PORT, function () {
      console.log(
        `websocket listen PORT ${
          connectedServer.address().port
        }, mode: ${mode} - PID: ${process.pid}`
      );
    });
    connectedServer.on("error", (error) => console.log(`Error: ${error}`));
  }
} else {
  //fork default mode
  const connectedServer = httpServer.listen(PORT, function () {
    console.log(
      `websocket listen PORT ${
        connectedServer.address().port
      }, mode: ${mode} - PID: ${process.pid}`
    );
  });
  connectedServer.on("error", (error) => console.log(`Error: ${error}`));
  process.on("exit", (code) => {
    console.log("Exit code -> ", code);
  });
}
