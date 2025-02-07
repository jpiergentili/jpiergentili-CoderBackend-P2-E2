import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      qty: { type: Number, required: true }
    }
  ]
});

const TicketModel = mongoose.model('Ticket', ticketSchema);
export default TicketModel;