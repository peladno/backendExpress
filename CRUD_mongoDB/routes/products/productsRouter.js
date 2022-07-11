const { Router } = require("express");
const router = Router();

const FactoryDao = require('../../src/index');
const DAO = FactoryDao();

function auth(request, resolve, next) {
  if('admin' in request.headers) next()
  else {
      resolve.status(400)
      resolve.send('No admin')
  }
}

router.get("/", async (request, resolve) => {
  try {
    const data = await DAO.products.getAll();
    resolve.send(data);
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.get("/:id", async (request, resolve) => {
  const id= request.params;

  try {
    const data = await DAO.products.getByID(idNumber);
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

router.delete("/:id", auth, async (request, resolve) => {
  const id = request.params;


  try {
    await DAO.products.deleteById(id);
    resolve.send("Product deleted");
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.post("/", auth, (request, resolve) => {
  const { name, code, description, imageURL, stock, price } = request.body;
  DAO.products.save({ name, code, description, imageURL, stock, price });
  resolve.send({ Message: "Product saved" })
});

router.put("/:id", auth, async (request, resolve) => {
  try {
    const id  = request.params;
    const newProduct = request.body;

    await DAO.products.updateItems(id, newProduct);
    resolve.send({ message: `Product updated` });
  } catch (error) {
    resolve.status(500);
    resolve(error);
  }
});

module.exports = router;