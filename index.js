const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () =>{
  console.log(`Server http on ${PORT}...`);
});
server.on('error', error => console.log("Error on server", error));

const Container = require('./desafioArchivos');

const container = new Container('file.json');

app.get("/", (request, resolve) => {
  resolve.send(
    "<h1 style='color: blue;'>Hola a todos</h1>"
  )
})

/*container.save({
  item: phone,
  price: 10000
})

container.save({
  item: tv, 
  price:20000
})*/


