import CartDAO from "../dao/mongo/cart.dao.js";

class CartRepository {
    async getAll() {
        return await CartDAO.getAll();
    }

    async getById(id) {
        return await CartDAO.getById(id);
    }

    async getByUserId(userId) {
        return await CartDAO.getByUserId(userId);
    }

    async create(cartData) {
        return await CartDAO.create(cartData);
    }

    async update(cartId, cartData) {
        console.log(`🔄 Actualizando carrito en la base de datos con ID: ${cartId}`);
        console.log("📦 Datos enviados para actualización:", cartData);
        
        return await CartDAO.update(cartId, cartData);
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const updatedProducts = cart.cartProducts.filter(item => 
            item.product._id.toString() !== productId
        );

        return await this.updateCart(cartId, updatedProducts);
    }

    async emptyCart(cartId) {
        console.log(`🗑️ Vaciando carrito en la base de datos con ID: ${cartId}`);
        
        return await CartDAO.update(cartId, { cartProducts: [] });
    }       

    async delete(id) {
        return await CartDAO.delete(id);
    }
}

export default new CartRepository();
