import express from "express";
import path from "path";
import dotenv from "dotenv";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import connectDB from "./config/db.config.js";
import initializePassport from "./config/passport.config.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";

dotenv.config();
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use(cookieParser());

// Configuración de sesiones
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.MONGO_DBNAME,
      ttl: 60 * 60 * 24,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Configuración de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine(
  "handlebars",
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      eq: (a, b) => a === b,
      multiply: (a, b) => a * b,
      startsWith: (str, prefix) => typeof str === "string" && str.startsWith(prefix),
      or: (a, b) => a || b
    },
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Registrar routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);

// Inicializar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
