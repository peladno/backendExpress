const { Router } = require("express");
const router = Router();

const cartContainer = require("../../modulos/cart/cartMethods");
const cart = new cartContainer("modulos/cart/cart.json");

router.post("/", (request, resolve) => {
  const newData = request.body;
  cart.save(newData);
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


router.get("/:id/productos", async (request, resolve) => {
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
})
/*
router.post("/:id/productos", (request, resolve) => {
//Para incorporar productos al carrito por su id de producto
})

router.delete("/:id/productos/:id_prod", (request, resolve) => {
//Eliminar un producto del carrito por su id de carrito y de producto
   
})
*/
module.exports = router;
