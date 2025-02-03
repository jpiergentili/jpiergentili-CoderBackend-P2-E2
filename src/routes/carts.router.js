import { Router } from "express";
import CartController from "../controllers/cart.controller.js"; // ✅ Asegurar que está importado correctamente
import { passportCall, authorizationRole } from "../middlewares/auth.js"; // ✅ Asegurar importaciones correctas

const router = Router();

// Obtener todos los carritos
router.get("/", CartController.getAllCarts);

// Obtener un carrito por ID
router.get("/:cid", CartController.getCartById);

// Crear un nuevo carrito
router.post("/", CartController.createCart);

// Agregar un producto al carrito (solo usuarios)
router.post(
  "/:cid/product/:pid",
  passportCall("current"),
  authorizationRole(["user"]),
  CartController.addProductToCart
);

// Actualizar un carrito completo con un arreglo de productos
router.put("/:cid", CartController.updateCart);

// Eliminar un carrito
router.delete("/:cid", CartController.deleteCart);

export default router;