import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const router = Router();

router.get("/", ProductController.getAllProducts);
router.get("/update/:pid", ProductController.getProductUpdateView);
router.get("/create", ProductController.getProductCreateView);
router.get("/:pid", ProductController.getProductById);
router.post("/", ProductController.createProduct);
router.put("/:pid", ProductController.updateProduct);
router.delete("/:pid", ProductController.deleteProduct);

export default router;