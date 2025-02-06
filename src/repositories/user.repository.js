import UserDAO from "../dao/mongo/user.dao.js";

class UserRepository {
    async getAll() {
        return await UserDAO.getAll();
    }

    async getById(id, asDTO = true) {
        return await UserDAO.getById(id, asDTO);
    }

    async getByEmail(email, asDTO = true, includePassword = false) {
        return await UserDAO.getByEmail(email, asDTO, includePassword);
    }

    async create(userData) {
        return await UserDAO.create(userData);
    }

    async update(id, userData) {
        return await UserDAO.update(id, userData);
    }

    async delete(id) {
        return await UserDAO.delete(id);
    }
}

export default new UserRepository();
