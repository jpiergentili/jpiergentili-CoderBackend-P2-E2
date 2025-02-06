import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { createHash, isValidPassword } from "../utils.js";
import UserService from "../services/user.service.js"; // 🔹 Importación corregida
import dotenv from "dotenv";
dotenv.config();


dotenv.config();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Estrategia de GitHub
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email || `${profile.username}@github.com`;
          let user = await UserService.getUserByEmail(email);
          if (!user) {
            const newUser = {
              first_name: profile.displayName || profile.username,
              last_name: "GitHub",
              age: 36,
              email,
              password: "Autenticado por terceros",
            };
            user = await UserService.createUser(newUser);
            
            if (!user || !user._id) {
              console.error("❌ Error: No se pudo obtener un ID válido para el usuario de GitHub.");
              return done(new Error("Error al crear usuario con GitHub"));
            }
            
          }
          done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserService.getUserById(jwt_payload.id, false);
          return done(null, user || false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia local para registro
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const existingUser = await UserService.getUserByEmail(email);
          if (existingUser) return done(null, false, { message: "El usuario ya existe" });  
          // 🔹 Crear el usuario en la base de datos
          const newUser = await UserService.createUser({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          });
  
          if (!newUser) {
            return done(null, false, { message: "Error al crear el usuario" });
          }
  
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  // Estrategia local para login
  passport.use(
    "login",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          // 🔹 Obtener usuario incluyendo la contraseña
          const user = await UserService.getUserByEmail(email, false, true);
  
          console.log("🔍 Usuario encontrado:", user);
          console.log("🔐 Contraseña en la BD:", user ? user.password : "Usuario no encontrado");
  
          if (!user || !user.password) {
            console.log("❌ Error: Usuario sin contraseña.");
            return done(null, false, { message: "Credenciales incorrectas" });
          }
  
          if (!isValidPassword(user, password)) {
            console.log("❌ Error: Contraseña incorrecta.");
            return done(null, false, { message: "Credenciales incorrectas" });
          }
          
          return done(null, user);
        } catch (error) {
          console.error("❌ Error en autenticación:", error);
          return done(error);
        }
      }
    )
  );  
  
  passport.serializeUser((user, done) => {
    if (!user || !user._id) {
      console.error("❌ Error: El usuario no tiene un ID válido.");
      return done(new Error("Usuario sin ID válido."));
    }
    done(null, user._id.toString());
  });
 
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserService.getUserById(id, false);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
