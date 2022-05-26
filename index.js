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
  } catch (e) {
    resolve.status(500);
    resolve.send(e)
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

  } catch (e) {
    resolve.status(500);
    resolve.send(e)
  }
})

router.delete("/:id", async (request, resolve) => {

  const id = Number(request.params.id)

  try {
    await products.deleteById(id);
    resolve.send("Producto deleted");

  } catch (e) {
    resolve.status(500);
    resolve.send(e)
  }
})

router.post("/", (request, resolve) => {
  const newData = request.body
  products.save(newData);
  resolve.send("Product saved")
})

router.put("/:id", (request, resolve) => {
  const id = Number(request.params.id);

})

app.use("/api/products", router);