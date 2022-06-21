const { Router } = require("express");
const router = Router();

const cartContainer = require("../../modulos/cart/cartMethods");
const cart = new cartContainer("modulos/cart/cart.json");

router.post("/", (request, resolve) => {
  const newData = request.body;
  cart.createCart(newData);
  resolve.send({ message: "Cart saved" });
});

router.delete("/:id/products", async (request, resolve) => {
  const { id } = request.params;
  const idNumber = Number(id);

  try {
    await cart.deleteById(idNumber);
    resolve.send("Cart deleted");
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});

router.get("/:id/products", async (request, resolve) => {
  const { id } = request.params;
  const idNumber = Number(id);

  try {
    const data = await cart.getByID(idNumber);
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

router.post("/:id/products", async (request, resolve) => {
  const { id } = request.params;
  const idNumber = Number(id);
  const newData = request.body;

  try {
    await cart.saveCart(newData, idNumber);
    resolve.send({ message: "Products Saved in cart" });
  } catch (error) {
    resolve.status(500);
    resolve.send(error);
  }
});
/*
router.delete("/:id/productos/:id_prod", (request, resolve) => {
//Eliminar un producto del carrito por su id de carrito y de producto
   
})
*/
module.exports = router;
