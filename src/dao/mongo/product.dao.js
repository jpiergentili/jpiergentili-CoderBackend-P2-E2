import productModel from "../models/product.model.js";
import ProductDTO from "../../dto/product.dto.js";

class ProductDAO {
    async getAll(filter = {}, options = {}) {
        const products = await productModel.paginate(filter, options);
        return {
            docs: products.docs.map(product => new ProductDTO(product)),
            pagination: {
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
            }
        };
    }

    async getById(id) {
        const product = await productModel.findById(id);
        return product ? new ProductDTO(product) : null;
    }

    async create(productData) {
        const product = await productModel.create(productData);
        return new ProductDTO(product);
    }

    async update(id, productData) {
        const product = await productModel.findByIdAndUpdate(id, productData, { new: true });
        return product ? new ProductDTO(product) : null;
    }

    async delete(id) {
        return await productModel.findByIdAndDelete(id);
    }
}

export default new ProductDAO();