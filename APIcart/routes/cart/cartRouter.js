const { Router } = require("express");
const router = Router();

const cartContainer = require("../../modulos/cart/cartMethods");
const cart = new cartContainer("modulos/cart/cart.json");

router.post("/", (request, resolve) => {
  const newData = request.body;
  const cartId = cart.createCart(newData);
  resolve.send({ message: "Cart saved", cartId });
});

router.delete("/:id/products", async (request, resolve) => {
  const { id } = request.params;
  const cartId = Number(id);

  try {
    await cart.deleteById(cartId);
    resolve.send("Cart deleted");
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.get("/:id/products", async (request, resolve) => {
  const { id } = request.params;
  const cartId = Number(id);

  try {
    const data = await cart.getByID(cartId);
    if (data === undefined) {
      resolve.send({ error: "product not found" });
    } else {
      resolve.send({ message: "product found", data });
    }
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.post("/:id/products", async (request, resolve) => {
  const { id } = request.params;
  const cartID = Number(id);
  const newData = request.body;

  const getCart = await cart.getByID(cartID);
  console.log(getCart);
  getCart.products.push(newData);

  try {
    await cart.editCart(getCart, cartID);
    resolve.send({ message: "Products Saved in cart" });
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.delete("/:id/products/:id_prod", async (request, resolve) => {
 
  const { id, id_prod } = request.params;
  const cartID = Number(id);
  const prodID = Number(id_prod);


  try {
    const deleteProduct = await cart.deleteProduct(cartID, prodID);
  
    resolve.send({ message: "Product deleted", deleteProduct });
  }catch (error) {
    resolve.status(500);
    resolve.send(error);
  }

});

module.exports = router;
