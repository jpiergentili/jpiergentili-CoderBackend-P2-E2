import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { passportCall, authorizationRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", ProductController.getAllProducts);
router.get("/:pid", ProductController.getProductById);


router.post("/", passportCall("current"), authorizationRole(["admin"]), ProductController.createProduct);
router.put("/:pid", passportCall("current"), authorizationRole(["admin"]), ProductController.updateProduct);
router.delete("/:pid", passportCall("current"), authorizationRole(["admin"]), ProductController.deleteProduct);

export default router;
