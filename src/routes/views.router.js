import { Router } from "express";
import productService from "../services/product.service.js";

const router = Router();

// Ruta para la vista estática de productos
router.get("/", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  try {
    const products = limit ? await productService.getAllProducts({}, { limit }) : await productService.getAllProducts();
    res.render("home", {
      products: products.docs,
      title: "Mercadoliebre",
      style: "home.css",
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;