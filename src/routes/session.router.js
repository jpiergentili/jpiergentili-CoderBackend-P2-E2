
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth.js";
import dotenv from "dotenv";
import UserDTO from "../dto/user.dto.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";

dotenv.config();

const router = Router();

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login", { title: "Iniciar Sesión", style: "home.css" });
});

router.get("/register", isLoggedOut, (req, res) => {
  res.render("register", { title: "Registro", style: "home.css" });
});

router.get("/perfil", isLoggedIn, (req, res) => {
  res.render("perfil", { title: "Perfil", user: req.session.user, style: "home.css" });
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubcallback", passport.authenticate("github", {
  failureRedirect: "/api/session/login"
}), (req, res) => {
  const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true });
  req.session.user = req.user;
  res.redirect("/api/session/perfil");
});

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const userDTO = new UserDTO(req.user);
  res.json({ status: "success", user: userDTO });
});;

router.post("/register", async (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    if (err) {
      console.error("❌ Error en Passport:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (!user) {
      console.error("❌ Error: No se pudo registrar el usuario");
      return res.status(400).json({ error: info?.message || "Registro fallido" });
    }

    try {
      const existingUser = await UserService.getUserByEmail(user.email);
      if (!existingUser) {
        return res.status(400).json({ error: "Error al registrar el usuario" });
      }

      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true }).json({ status: "success", message: "Usuario registrado correctamente" });
    } catch (error) {
      console.error("❌ Error en el registro:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err) return res.status(500).json({ error: "Error en la autenticación" });
    if (!user) return res.status(400).json({ error: info.message || "Credenciales inválidas" });

    req.login(user, async (err) => {
      if (err) return res.status(500).json({ error: "Error al iniciar sesión" });

      console.log("🔍 Buscando carrito para el usuario:", user._id);
      let cart = user.cart ? await CartService.getCartById(user.cart) : null;

      if (!cart) {
        console.log("⚠️ Usuario sin carrito, creándolo...");
        cart = await CartService.createCart({ 
          first_name: user.first_name, 
          last_name: user.last_name, 
          cartProducts: [] 
        });

        await UserService.updateUser(user._id, { cart: cart._id });
      }

      console.log("✅ Carrito asignado al usuario:", cart._id);

      req.session.user = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        cart: cart._id,
      };

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true }).json({ status: "success", message: "Sesión iniciada correctamente" });
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
    res.clearCookie("connect.sid");
    res.redirect("/api/session/login");
  });
});

export default router;
