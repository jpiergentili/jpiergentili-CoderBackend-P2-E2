import CartService from "../services/cart.service.js";

class CartController {
    async getAllCarts(req, res) {
        try {
            const carts = await CartService.getAllCarts();
            res.json(carts);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener carritos" });
        }
    }

    async getCartById(req, res) {
        try {
            const cart = await CartService.getCartById(req.params.cid);
            if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el carrito" });
        }
    }

    async createCart(req, res) {
        try {
            const newCart = await CartService.createCart(req.body);
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: "Error al crear el carrito" });
        }
    }

    async updateCart(req, res) {
        try {
            const updatedCart = await CartService.updateCart(req.params.cid, req.body);
            if (!updatedCart) return res.status(404).json({ error: "Carrito no encontrado" });
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el carrito" });
        }
    }

    async deleteCart(req, res) {
        try {
            const deletedCart = await CartService.deleteCart(req.params.cid);
            if (!deletedCart) return res.status(404).json({ error: "Carrito no encontrado" });
            res.json({ message: "Carrito eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el carrito" });
        }
    }    
    
    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { qty } = req.body;
    
            console.log("🛒 Agregando producto al carrito");
            console.log("Cart ID recibido en el backend:", cid);
            console.log("Product ID recibido en el backend:", pid);
            console.log("Cantidad recibida:", qty);
    
            if (!cid || !pid || !qty || qty <= 0) {
                console.error("❌ Error: Datos inválidos.");
                return res.status(400).json({ error: "Datos inválidos. Se requiere un ID de carrito, ID de producto y una cantidad válida." });
            }
    
            const cart = await CartService.getCartById(cid);
            if (!cart) {
                console.error("❌ Error: Carrito no encontrado.");
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
    
            const existingProduct = cart.cartProducts.find(p => p.product._id.toString() === pid);
    
            if (existingProduct) {
                existingProduct.qty += qty;
                console.log("✅ Producto existente, cantidad actualizada:", existingProduct.qty);
            } else {
                cart.cartProducts.push({ product: pid, qty });
                console.log("✅ Producto agregado al carrito:", pid);
            }
    
            const updatedCart = await CartService.updateCart(cid, { cartProducts: cart.cartProducts });
    
            console.log("✅ Carrito actualizado correctamente.");
            res.json(updatedCart);
        } catch (error) {
            console.error("❌ Error al agregar producto al carrito:", error);
            res.status(500).json({ error: "Error al agregar producto al carrito" });
        }
    }  
    
}

export default new CartController();