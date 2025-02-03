import CartDAO from "../dao/mongo/cart.dao.js";

class CartRepository {
    async getAll() {
        return await CartDAO.getAll();
    }

    async getById(id) {
        return await CartDAO.getById(id);
    }

    async create(cartData) {
        return await CartDAO.create(cartData);
    }

    async update(id, cartData) {
        return await CartDAO.update(id, cartData);
    }

    async delete(id) {
        return await CartDAO.delete(id);
    }
}

export default new CartRepository();
