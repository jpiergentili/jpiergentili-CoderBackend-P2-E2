import cartModel from "../models/cart.model.js";
import CartDTO from "../../dto/cart.dto.js";

class CartDAO {
    async getAll() {
        const carts = await cartModel.find().populate('cartProducts.product');
        return carts.map(cart => new CartDTO(cart));
    }

    async getById(id) {
        const cart = await cartModel.findById(id).populate('cartProducts.product');
        return cart ? new CartDTO(cart) : null;
    }

    async create(cartData) {
        const cart = await cartModel.create(cartData);
        return new CartDTO(cart);
    }

    async update(id, cartData) {
        const cart = await cartModel.findByIdAndUpdate(id, cartData, { new: true }).populate('cartProducts.product');
        return cart ? new CartDTO(cart) : null;
    }

    async delete(id) {
        return await cartModel.findByIdAndDelete(id);
    }
}

export default new CartDAO();