import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DBNAME,
    });
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ No se pudo conectar con la base de datos", error);
    process.exit(1);
  }
};

export default connectDB;