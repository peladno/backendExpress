const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send(
    "<h1 style='color: blue;'>Hola a todos</h1>"
  )
})

let count = 0;

app.get("/visitas", (req, res) => {
  count++;
  res.send("contador visitas: " + count);
})

app.get("/fyh", (request, response) => {
  let fyh = new Date()
  response.send({ fyh: fyh.toLocaleString() })
})

const server = app.listen(PORT, () =>{
  conbsole.log(`Server http on ${PORT}...`);
});
server.on('error', error => console.log("Error on server", error))