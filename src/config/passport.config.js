import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { createHash, isValidPassword } from "../utils.js";
import userService from "../services/user.service.js";
import dotenv from "dotenv";

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
          let user = await userService.getUserByEmail(email);
          if (!user) {
            const newUser = {
              first_name: profile.displayName || profile.username,
              last_name: "GitHub",
              age: 18,
              email,
              password: "Autenticado por terceros",
            };
            user = await userService.createUser(newUser);
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
          const user = await userService.getUserById(jwt_payload.id, false);
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
          const existingUser = await userService.getUserByEmail(email, false);
          if (existingUser) return done(null, false);
          const newUser = await userService.createUser({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          });
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
          const user = await userService.getUserByEmail(email, false);
          if (!user || !isValidPassword(user, password)) {
            return done(null, false, { message: "Credenciales incorrectas" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getUserById(id, false);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
