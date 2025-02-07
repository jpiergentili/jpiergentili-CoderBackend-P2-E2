import { Router } from "express";
import CartService from '../services/cart.service.js'
import productService from "../services/product.service.js";
import { passportCall, authorizationRole } from "../middlewares/auth.js";

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

// Rutas protegidas para admins (Crear y Actualizar Productos)
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

router.get("/cart", passportCall("current"), authorizationRole(["user"]), async (req, res) => {
  try {
    const cart = await CartService.getCartByUserId(req.user._id);
    if (!cart) {
      return res.render("cartDetailUsers", { cart: { cartProducts: [] }, user: req.user, title: "Carrito" });
    }

    cart.cartProducts = cart.cartProducts.map(item => ({
      ...item,
      product: {
        ...item.product,
        thumbnail: item.product.thumbnail?.startsWith("http") ? item.product.thumbnail : "https://via.placeholder.com/150"
      }
    }));

    // Calcular el total del carrito
    let totalAmount = 0;
    cart.cartProducts = cart.cartProducts.map(item => {
      if (!item.product) {
        console.warn(`⚠️ Producto no encontrado en el carrito, ID del producto: ${item.product}`);
        return null; // Elimina productos inválidos del carrito
      }
      totalAmount += item.product.price * item.qty;
      return item;
    }).filter(Boolean); // Filtra productos `null`
    cart.totalAmount = totalAmount;

    res.render("cartDetailUsers", { cart, user: req.user, title: "Carrito" });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).send("Error al cargar el carrito");
  }
});

export default router;
