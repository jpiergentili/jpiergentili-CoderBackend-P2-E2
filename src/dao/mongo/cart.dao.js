import cartModel from "../models/cart.model.js";

class CartDAO {
    async getAll() {
        return await cartModel.find().populate('cartProducts.product');
    }

    async getById(id) {
        return await cartModel.findById(id).populate('cartProducts.product');
    }

    async getByUserId(userId) {
        console.log("🔍 Buscando carrito para el usuario:", userId);
        const user = await userModel.findById(userId).populate("cart"); // Buscamos el usuario con su carrito
        return user ? user.cart : null; // Devolvemos el carrito asociado al usuario
    }         

    async create(cartData) {
        return await cartModel.create(cartData);
    }

    async update(id, cartData) {
        return await cartModel.findByIdAndUpdate(id, cartData, { new: true }).populate('cartProducts.product');
    }    

    async delete(id) {
        return await cartModel.findByIdAndDelete(id);
    }
}

export default new CartDAO();
