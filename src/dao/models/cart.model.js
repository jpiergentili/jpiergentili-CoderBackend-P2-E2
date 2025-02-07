import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

const cartsCollection = "carts"

const cartSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  cartProducts: [
    { 
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' }, 
      qty: { type: Number, required: true }
    },
  ],
});

cartSchema.pre(['find', 'findOne', 'findById'], function () {
  this.populate('cartProducts.product');
});

cartSchema.plugin(mongoosePaginate)
const cartModel = mongoose.model(cartsCollection, cartSchema);

export default cartModel;
