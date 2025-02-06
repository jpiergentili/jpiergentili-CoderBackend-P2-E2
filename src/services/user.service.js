import UserRepository from "../repositories/user.repository.js";
import CartService from "../services/cart.service.js";

class UserService {
    async createUser(userData) {
        try {
            // Crear el usuario en la base de datos
            const newUser = await UserRepository.create(userData);
            if (!newUser || !newUser.id) throw new Error("No se pudo crear el usuario");
    
            // Crear el carrito con los datos del usuario
            const newCart = await CartService.createCart({ 
                first_name: newUser.first_name, 
                last_name: newUser.last_name, 
                cartProducts: [] 
            });
    
            // Actualizar el usuario con el ID del carrito
            await UserRepository.update(newUser.id || newUser._id, { cart: newCart._id });
    
            return { ...newUser, cart: newCart._id };
        } catch (error) {
            console.error("❌ Error al registrar usuario:", error);
            throw new Error("Error al registrar usuario.");
        }
    }

    async updateUser(id, userData) {
        return await UserRepository.update(id, userData);
    }

    async getUserById(id) {
        return await UserRepository.getById(id);
    }

    async getUserByEmail(email, asDTO = true, includePassword = false) {  
        return await UserRepository.getByEmail(email, asDTO, includePassword);
    }
}

export default new UserService();
