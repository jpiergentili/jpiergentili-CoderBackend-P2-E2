import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts", default: null },
  role: { type: String, default: "user" },
});

mongoose.set("strictQuery", false);
const userModel = mongoose.model("users", userSchema);

export default userModel;
