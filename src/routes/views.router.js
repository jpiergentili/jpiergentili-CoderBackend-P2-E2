import { Router } from "express";
import productService from "../services/product.service.js";
import { passportCall, authorizationRole } from "../middlewares/auth.js"; // 🔥 Importamos los middlewares

const router = Router();

// Ruta para renderizar la vista de productos
router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { category: query } : {};
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
      lean: true,
    };

    const products = await productService.getAllProducts(filter, options);

    res.render("home", {
      products: products.docs,
      title: "Mercadoliebre",
      style: "home.css",
      user: req.session.user || null,
      hasPrevPage: products.pagination.hasPrevPage,
      hasNextPage: products.pagination.hasNextPage,
      prevLink: products.pagination.hasPrevPage ? `/products?page=${products.pagination.prevPage}` : null,
      nextLink: products.pagination.hasNextPage ? `/products?page=${products.pagination.nextPage}` : null,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// 🔥 Rutas protegidas para admins (Crear y Actualizar Productos)
router.get("/products/create", passportCall("current"), authorizationRole(["admin"]), (req, res) => {
  res.render("createProduct", { title: "Crear Producto", user: req.session.user });
});

router.get("/products/update/:pid", passportCall("current"), authorizationRole(["admin"]), async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    res.render("updateProduct", { title: "Actualizar Producto", product, user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

export default router;
