import UserRepository from "../repositories/user.repository.js";

class UserService {
    async getAllUsers() {
        return await UserRepository.getAll();
    }

    async getUserById(id) {
        return await UserRepository.getById(id, false);
    }

    async getUserByEmail(email) {
        return await UserRepository.getByEmail(email, false);
    }

    async createUser(userData) {
        return await UserRepository.create(userData);
    }

    async updateUser(id, userData) {
        return await UserRepository.update(id, userData);
    }

    async deleteUser(id) {
        return await UserRepository.delete(id);
    }
}

export default new UserService();