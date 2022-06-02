const express = require('express');
const { Router } = express;

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server http on ${PORT}...`);
});
server.on('error', error => console.log("Error on server", error));

const Container = require('./arrayMethods');
const products = new Container('file.json');

app.use('/static', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (request, resolve) => {
  resolve.send(
    "<h1>API RESTfull</h1>"
  )
})

const router = Router();

router.get("/", async (request, resolve) => {
  try {
    const data = await products.getAll();
    resolve.send(data)
  } catch (error) {
    resolve.status(500);
    resolve.send(error)
  }
})

router.get("/:id", async (request, resolve) => {

  const id = Number(request.params.id)

  try {
    const data = await products.getByID(id);
    if (data === undefined) {
      resolve.send({ error: "product not found" })
    } else {
      resolve.send(data)
    }

  } catch (error) {
    resolve.status(500);
    resolve.send(error)
  }
})

router.delete("/:id", async (request, resolve) => {

  const id = Number(request.params.id)

  try {
    await products.deleteById(id);
    resolve.send("Producto deleted");

  } catch (error) {
    resolve.status(500);
    resolve.send(error)
  }
})

router.post("/", (request, resolve) => {
  const newData = request.body
  products.save(newData);
  resolve.send("Product saved")
})


router.put("/:id", async (request, resolve) => {

  try {
    let newData = {};
    newData.item = request.body.item;
    newData.price = request.body.price;
    newData.id = parseInt(request.params.id);
    console.log(newData)

    await products.updateItems(newData);
    resolve.send("Product updated")

  } catch (error) {
    resolve.status(500);
    resolve(error)
  }

})

app.use("/api/products", router);