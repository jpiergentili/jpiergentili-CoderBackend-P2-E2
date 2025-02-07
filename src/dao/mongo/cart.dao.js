import cartModel from "../models/cart.model.js";
import userModel from "../models/user.model.js";

class CartDAO {
    async getAll() {
        return await cartModel.find().populate('cartProducts.product');
    }

    async getById(id) {
        return await cartModel.findById(id).populate('cartProducts.product');
    }

    async getByUserId(userId) {
        console.log("🔍 Buscando carrito para el usuario:", userId);
        const user = await userModel.findById(userId).populate("cart");
        return user ? user.cart : null;
    }         

    async create(cartData) {
        return await cartModel.create(cartData);
    }

    async update(id, cartData) {
        console.log(`🔄 Actualizando carrito con ID: ${id}, Datos:`, cartData);
        
        return await cartModel.findByIdAndUpdate(
            id, 
            { $set: { cartProducts: cartData.cartProducts } }, 
            { new: true }
        ).populate('cartProducts.product');
    }               

    async delete(id) {
        return await cartModel.findByIdAndDelete(id);
    }
}

export default new CartDAO();
