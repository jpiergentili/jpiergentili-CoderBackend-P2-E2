import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { passportCall, authorizationRole } from "../middlewares/auth.js";

const router = Router();

// Obtener todos los carritos
router.get("/", CartController.getAllCarts);

// Obtener un carrito por ID
router.get("/:cid", CartController.getCartById);

// Crear un nuevo carrito
router.post("/", CartController.createCart);

// Agregar un producto al carrito (solo usuarios)
router.post("/:cid/product/:pid", passportCall("current"), authorizationRole(["user"]), async (req, res) => {
  console.log("📡 Petición recibida en `/api/carts/:cid/product/:pid`");
  console.log("Cart ID recibido en la URL:", req.params.cid);
  console.log("Product ID recibido en la URL:", req.params.pid);
  console.log("Body recibido:", req.body);
  
  await CartController.addProductToCart(req, res);
});

// Actualizar un carrito agregando productos o modificando cantidad
router.put("/:cid", passportCall("current"), authorizationRole(["user"]), async (req, res) => {
  await CartController.updateCart(req, res);
});

// Eliminar un carrito
router.delete("/:cid/product/:pid", passportCall("current"), authorizationRole(["user"]), async (req, res) => {
  await CartController.removeProduct(req, res);
});

router.put("/:cid/empty", passportCall("current"), authorizationRole(["user"]), async (req, res) => {
  await CartController.emptyCart(req, res);
});

export default router;