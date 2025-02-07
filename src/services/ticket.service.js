// ticket.service.js
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

    let successfulPurchase = []; // Productos y cantidades que se compran
    let failedPurchase = []; // Productos y cantidades que quedan pendientes
    let totalAmount = 0;

    for (const item of cart.cartProducts) {
      const requestedQty = item.qty;
      const availableStock = item.product.stock;

      if (availableStock <= 0) {
        // Sin stock: nada se compra y se deja la cantidad completa en el carrito
        failedPurchase.push(item);
        continue;
      }

      if (availableStock >= requestedQty) {
        // Stock suficiente: se compra la cantidad solicitada
        await productModel.findByIdAndUpdate(
          item.product._id,
          { $inc: { stock: -requestedQty } },
          { new: true }
        );
        successfulPurchase.push({
          product: item.product._id,
          qty: requestedQty,
        });
        totalAmount += item.product.price * requestedQty;
      } else {
        // Stock parcial: se compra todo lo que esté disponible y se deja el remanente
        await productModel.findByIdAndUpdate(
          item.product._id,
          { $set: { stock: 0 } },
          { new: true }
        );
        successfulPurchase.push({
          product: item.product._id,
          qty: availableStock,
        });
        totalAmount += item.product.price * availableStock;
        const remainder = requestedQty - availableStock;
        // Se agrega al arreglo de productos no comprados por completo.
        failedPurchase.push({
          product: item.product, // Se conserva el objeto completo para mostrar detalles en la vista
          qty: remainder,
        });
      }
    }

    if (successfulPurchase.length === 0) {
      // Si no se pudo comprar nada, se retorna null.
      return null;
    }

    // Se crea el ticket con los datos de la compra
    const ticketData = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail,
      products: successfulPurchase,
    };

    const ticket = await TicketRepository.create(ticketData);

    // Se actualiza el carrito dejando solo los productos pendientes de compra.
    await CartService.updateCart(cartId, failedPurchase);

    // Se retorna un objeto con el ticket y la lista de productos que quedaron pendientes.
    return { ticket, failedProducts: failedPurchase };
  }

  async getTicketById(id) {
    return await TicketRepository.getById(id);
  }
}

export default new TicketService();
