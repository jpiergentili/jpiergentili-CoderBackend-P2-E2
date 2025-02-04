import ProductService from "../services/product.service.js";

class ProductController {
    async getAllProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const filter = query ? { category: query } : {};
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
                lean: true,
            };
            const products = await ProductService.getAllProducts(filter, options);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener productos" });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.pid);
            if (!product) return res.status(404).json({ error: "Producto no encontrado" });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el producto" });
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = await ProductService.createProduct(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: "Error al crear el producto" });
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const productData = req.body;
    
            if (!productData.title || !productData.description || !productData.price || !productData.stock) {
                return res.status(400).json({ error: "Todos los campos son obligatorios" });
            }
    
            const updatedProduct = await ProductService.updateProduct(pid, productData);
            if (!updatedProduct) return res.status(404).json({ error: "Producto no encontrado" });
    
            res.json(updatedProduct);
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            res.status(500).json({ error: "Error al actualizar el producto" });
        }
    }    

    async deleteProduct(req, res) {
        try {
            const deletedProduct = await ProductService.deleteProduct(req.params.pid);
            if (!deletedProduct) return res.status(404).json({ error: "Producto no encontrado" });
            res.json({ message: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el producto" });
        }
    }

    async getProductUpdateView(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.pid);
            if (!product) return res.status(404).json({ error: "Producto no encontrado" });
            res.render("updateProduct", { product, title: "Actualizar Producto", style: "home.css" });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el producto" });
        }
    }

    async getProductCreateView(req, res) {
        res.render("createProduct", { title: "Crear Producto", style: "home.css" });
    }
}

export default new ProductController();
