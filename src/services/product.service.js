import ProductRepository from "../repositories/product.repository.js";

class ProductService {
    async getAllProducts(filter, options) {
        return await ProductRepository.getAll(filter, options);
    }

    async getProductById(id) {
        return await ProductRepository.getById(id);
    }

    async createProduct(productData) {
        return await ProductRepository.create(productData);
    }

    async updateProduct(id, productData) {
        return await ProductRepository.update(id, productData);
    }

    async deleteProduct(id) {
        return await ProductRepository.delete(id);
    }
}

export default new ProductService();
