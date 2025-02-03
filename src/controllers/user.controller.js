import UserService from "../services/user.service.js";

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener usuarios" });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.uid);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el usuario" });
        }
    }

    async createUser(req, res) {
        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: "Error al crear el usuario" });
        }
    }

    async updateUser(req, res) {
        try {
            const updatedUser = await UserService.updateUser(req.params.uid, req.body);
            if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el usuario" });
        }
    }

    async deleteUser(req, res) {
        try {
            const deletedUser = await UserService.deleteUser(req.params.uid);
            if (!deletedUser) return res.status(404).json({ error: "Usuario no encontrado" });
            res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el usuario" });
        }
    }
}

export default new UserController();