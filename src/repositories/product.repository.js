import ProductDAO from "../dao/mongo/product.dao.js";

class ProductRepository {
    async getAll(filter, options) {
        return await ProductDAO.getAll(filter, options);
    }

    async getById(id) {
        return await ProductDAO.getById(id);
    }

    async create(productData) {
        return await ProductDAO.create(productData);
    }

    async update(id, productData) {
        return await ProductDAO.update(id, productData);
    }

    async delete(id) {
        return await ProductDAO.delete(id);
    }
}

export default new ProductRepository();
