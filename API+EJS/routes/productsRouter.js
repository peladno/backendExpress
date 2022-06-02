const Container = require('../arrayMethods');
const products = new Container('file.json');
const { Router } = require('express');

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

module.exports = router;