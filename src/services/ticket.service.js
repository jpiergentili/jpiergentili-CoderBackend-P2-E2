// Importa el modelo de producto
import productModel from "../dao/models/product.model.js";
import TicketRepository from "../repositories/ticket.repository.js";
import CartService from "../services/cart.service.js";
import { v4 as uuidv4 } from "uuid";

class TicketService {
  async createPurchase(cartId, userEmail) {
    const cart = await CartService.getCartById(cartId);
    if (!cart || cart.cartProducts.length === 0) {
      return null;
    }

    let successfulPurchase = [];
    let failedPurchase = [];
    let totalAmount = 0;

    // Iterar sobre cada producto del carrito
    for (const item of cart.cartProducts) {
      // Verificar si hay stock suficiente
      if (item.product.stock >= item.qty) {
        // Actualizar el stock del producto directamente en la base de datos
        await productModel.findByIdAndUpdate(
          item.product._id,
          { $inc: { stock: -item.qty } },
          { new: true }
        );
        successfulPurchase.push({
          product: item.product._id,
          qty: item.qty,
        });
        totalAmount += item.product.price * item.qty;
      } else {
        failedPurchase.push(item);
      }
    }

    // Si ningún producto pudo ser comprado, retornamos null o el arreglo de fallos (según tu lógica)
    if (successfulPurchase.length === 0) {
      return null;
    }

    // Se genera el ticket con un código único
    const ticketData = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail,
      products: successfulPurchase,
    };

    const ticket = await TicketRepository.create(ticketData);

    // Actualizar el carrito para que solo contenga los productos que no pudieron procesarse
    cart.cartProducts = failedPurchase;
    await CartService.updateCart(cartId, failedPurchase);

    return ticket;
  }

  async getTicketById(id) {
    return await TicketRepository.getById(id);
  }
}

export default new TicketService();
