const { Router } = require("express");
const router = Router();

const Container = require('../../modulos/products/productsMethods');
const products = new Container('modulos/products/products.json');

router.get("/", async (request, resolve) => {
  try {
    const data = await products.getAll();
    resolve.send(data);
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.get("/:id", async (request, resolve) => {
  const { id } = request.params;
  const idNumber = Number(id);

  try {
    const data = await products.getByID(idNumber);
    if (data === undefined) {
      resolve.send({ error: "product not found" });
    } else {
      resolve.send(data);
    }
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.delete("/:id", async (request, resolve) => {
  const { id } = request.params;
  const idNumber = Number(id);

  try {
    await products.deleteById(idNumber);
    resolve.send("Product deleted");
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.post("/", (request, resolve) => {
  const { name, code, description, url, stock, price } = request.body;
  console.log({ name, code, description, url, stock, price })
  products.save({ name, code, description, url, stock, price });
  resolve.send({ Message: "Product saved" });
});

router.put("/:id", async (request, resolve) => {
  try {
    let newData = {};
    newData.name = request.body.name;
    newData.price = request.body.price;
    newData.description = request.body.description;
    newData.url = request.body.url;
    newData.code = request.body.code;
    newData.stock = request.body.stock;
    newData.id = parseInt(request.params.id);
    console.log(newData);

    await products.updateItems(newData);
    resolve.send({ message: `Product with id: ${newData.id} updated` });
  } catch (error) {
    resolve.status(500);
    resolve(error);
  }
});

module.exports = router;
