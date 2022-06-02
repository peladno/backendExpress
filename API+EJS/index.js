const express = require('express');
const Container = require('./arrayMethods');
const products = new Container('file.json');

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server http on ${PORT}...`);
});
server.on('error', error => console.log("Error on server", error));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', './views')
app.set('view engine', 'ejs')

app.get("/", (request, resolve) => {
  resolve.render('index')
})

app.get("/products", (request, resolve) => {
  resolve.render(products)
})
