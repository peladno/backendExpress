const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () =>{
  console.log(`Server http on ${PORT}...`);
});
server.on('error', error => console.log("Error on server", error));

const Container = require('./desafioArchivos');

const products = new Container('file.json');

app.get("/", (request, resolve) => {
  resolve.send(
    "<h1>Hola a todos</h1>"
  )
})

app.get("/productos", async (request, resolve) => {
  try {
    const data = await products.getAll();
    resolve.send(data)
  } catch (e) {
    resolve.status(500);
    resolve.send(e)
  }
})

app.get("/productosRandom", async (request, resolve) => {
  try {
    const data = await products.randomItems();
    resolve.send(data)
  } catch (e) {
    resolve.status(500);
    resolve.send(e)
  }
})
