
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth.js";
import dotenv from "dotenv";
import UserDTO from "../dto/user.dto.js";

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

  const userDTO = new UserDTO(req.user); // Usamos el DTO
  res.json({ status: "success", user: userDTO });
});;

router.post("/register", async (req, res, next) => {
  passport.authenticate("register", (err, user) => {
    if (err || !user) return res.status(400).json({ error: "Registro fallido" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true }).redirect("/api/session/login");
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Error en la autenticación" });
    if (!user) return res.status(400).json({ error: info.message || "Credenciales inválidas" });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Error al iniciar sesión" });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      req.session.user = user;
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
