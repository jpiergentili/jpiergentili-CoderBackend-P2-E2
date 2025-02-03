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
}

export default new CartController();
