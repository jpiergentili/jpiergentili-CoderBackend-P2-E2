import userModel from "../models/user.model.js";
import UserDTO from "../../dto/user.dto.js";

class UserDAO {
    async getAll() {
        const users = await userModel.find();
        return users.map(user => new UserDTO(user));
    }

    async getById(id, asDTO = true) {
        const user = await userModel.findById(id);
        return user ? (asDTO ? new UserDTO(user) : user) : null;
    }

    async getByEmail(email, asDTO = true, includePassword = false) {
        let userQuery = userModel.findOne({ email }).select("+password").lean();
        
        const user = await userQuery;
        
        if (!user) return null;
    
        return asDTO ? new UserDTO(user, includePassword) : user;
    }          

    async create(userData) {
        const user = await userModel.create(userData);
        return new UserDTO(user);
    }

    async update(id, userData) {
        const user = await userModel.findByIdAndUpdate(id, userData, { new: true });
        return user ? new UserDTO(user) : null;
    }

    async delete(id) {
        return await userModel.findByIdAndDelete(id);
    }
}

export default new UserDAO();
