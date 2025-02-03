import CartRepository from "../repositories/cart.repository.js";

class CartService {
    async getAllCarts() {
        return await CartRepository.getAll();
    }

    async getCartById(id) {
        return await CartRepository.getById(id);
    }

    async createCart(cartData) {
        return await CartRepository.create(cartData);
    }

    async updateCart(id, cartData) {
        return await CartRepository.update(id, cartData);
    }

    async deleteCart(id) {
        return await CartRepository.delete(id);
    }
}

export default new CartService();
