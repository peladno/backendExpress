const { Router } = require("express");
const router = Router();

const FactoryDao = require("../../src/index");
const DAO = FactoryDao();

//get all carts
router.get("/", async (request, resolve) => {
  try {
    const data = await DAO.cart.getAll();
    resolve.send(data);
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});


//save empty cart
router.post("/", async(request, resolve) => {
  try {
    const cart = []
    await DAO.cart.save(cart);
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
  resolve.send({ message: "Cart saved"});
});


//delete cart by id
router.delete("/:id/products", async (request, resolve) => {
  const id = request.params;

  try {
    await DAO.cart.deleteById(id);
    resolve.send("Cart deleted");
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

//get cart by id
router.get("/:id/products", async (request, resolve) => {
  const id = request.params;

  try {
    const data = await DAO.cart.getByID(id);
    if (data === undefined) {
      resolve.send({ error: "product not found" });
    } else {
      resolve.send({ message: "cart found", data });
    }
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});


//add product to cart
router.post("/:id/products", async (request, resolve) => {
  const id = request.params;
  const newData = request.body;

  try {
    const data = await DAO.cart.editCart(newData, id);
    resolve.send({ message: "Products Saved in cart", data });
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

//delete product by id and from cart by id
router.delete("/:id/products/:id_prod", async (request, resolve) => {
  const { id, id_prod } = request.params;
  const cartID = id;
  const prodID = id_prod;

  try {
    const deleteProduct = await DAO.cart.deleteProduct(cartID, prodID);

    resolve.send({ message: "Product deleted", deleteProduct });
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

module.exports = router;
