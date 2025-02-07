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
            const { cid } = req.params;
            const { cartProducts } = req.body;
    
            console.log(`🔄 Actualizando carrito con ID: ${cid}`);
            console.log("📦 Nuevos productos en el carrito:", cartProducts);
    
            const updatedCart = await CartService.updateCart(cid, cartProducts);
    
            if (!updatedCart) {
                console.warn(`⚠️ No se encontró el carrito con ID: ${cid}`);
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
    
            console.log("✅ Carrito actualizado correctamente.");
            res.json(updatedCart);
        } catch (error) {
            console.error("❌ Error al actualizar el carrito:", error);
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
    
            const updatedCart = await CartService.addProductToCart(cid, pid, qty);
    
            console.log("✅ Carrito actualizado correctamente:", updatedCart);
            res.json(updatedCart);
        } catch (error) {
            console.error("❌ Error al agregar producto al carrito:", error);
            res.status(500).json({ error: "Error al agregar producto al carrito" });
        }
    }      
    
    async removeProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            console.log(`🗑️ Eliminando producto ${pid} del carrito ${cid}`);
    
            const updatedCart = await CartService.removeProductFromCart(cid, pid);
    
            console.log("✅ Producto eliminado correctamente en la base de datos.");
            res.json(updatedCart);
        } catch (error) {
            console.error("❌ Error al eliminar producto del carrito:", error);
            res.status(500).json({ error: "Error al eliminar el producto del carrito." });
        }
    }          

    async emptyCart(req, res) {
        try {
            const { cid } = req.params;
            console.log(`🗑️ Solicitando vaciar carrito con ID: ${cid}`);
            
            const updatedCart = await CartService.emptyCart(cid);
            
            console.log("✅ Carrito vaciado correctamente en la base de datos.");
            res.json({ message: "Carrito vaciado correctamente", cart: updatedCart });
        } catch (error) {
            console.error("❌ Error al vaciar el carrito:", error);
            res.status(500).json({ error: "Error al vaciar el carrito" });
        }
    }    
}

export default new CartController();