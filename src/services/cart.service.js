import CartRepository from "../repositories/cart.repository.js";

class CartService {
  async getAllCarts() {
    return await CartRepository.getAll();
  }

  async getCartById(id) {
    const cart = await CartRepository.getById(id);
    if (!cart) return null;

    cart.cartProducts = cart.cartProducts.filter(
      (item) => item.product !== null
    );

    return cart;
  }

  async getCartByUserId(userId) {
    console.log(`🔍 Buscando carrito para el usuario con ID: ${userId}`);
    const cart = await CartRepository.getByUserId(userId);

    if (!cart) {
      console.warn(`⚠️ No se encontró carrito para el usuario ${userId}`);
      return null;
    }

    console.log(
      `✅ Carrito encontrado: ${cart._id} con ${cart.cartProducts.length} productos.`
    );
    return cart;
  }

  async createCart(cartData) {
    return await CartRepository.create(cartData);
  }

  async updateCart(cartId, cartProducts) {
    console.log(`🛒 Actualizando carrito con ID: ${cartId}`);
    console.log("📦 Nuevos productos en el carrito:", cartProducts);

    const cart = await CartRepository.getById(cartId);
    if (!cart) {
        console.warn(`⚠️ No se encontró el carrito con ID: ${cartId}`);
        throw new Error("Carrito no encontrado");
    }

    cart.cartProducts = cartProducts;

    const updatedCart = await CartRepository.update(cartId, { cartProducts: cart.cartProducts });
    console.log("✅ Carrito actualizado en la base de datos.");
    return updatedCart;
  }

  async deleteCart(id) {
    return await CartRepository.delete(id);
  }

  async addProductToCart(cartId, productId, quantity) {
    console.log(
      `🛒 Agregando producto ${productId} con cantidad ${quantity} al carrito ${cartId}`
    );

    const cart = await CartRepository.getById(cartId);
    if (!cart) {
      console.warn(`⚠️ No se encontró el carrito con ID: ${cartId}`);
      throw new Error("Carrito no encontrado");
    }

    const existingProductIndex = cart.cartProducts.findIndex(
      (p) => p.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      cart.cartProducts[existingProductIndex].qty += quantity;
      console.log(
        `🔄 Producto ya existente. Nueva cantidad: ${cart.cartProducts[existingProductIndex].qty}`
      );
    } else {
      cart.cartProducts.push({ product: productId, qty: quantity });
      console.log(`✅ Producto agregado al carrito: ${productId}`);
    }

    const updatedCart = await CartRepository.update(cartId, {
      cartProducts: cart.cartProducts,
    });
    console.log("✅ Carrito actualizado en la base de datos.");
    return updatedCart;
  }

  async removeProductFromCart(cartId, productId) {
    console.log(`🗑️ Eliminando producto ${productId} del carrito ${cartId}`);

    const cart = await CartRepository.getById(cartId);
    if (!cart) {
        throw new Error("Carrito no encontrado");
    }

    cart.cartProducts = cart.cartProducts.filter(item => item.product._id.toString() !== productId);

    const updatedCart = await CartRepository.update(cartId, { cartProducts: cart.cartProducts });
    console.log("✅ Producto eliminado correctamente en la base de datos.");
    return updatedCart;
  }

  async emptyCart(cartId) {
    console.log(`🗑️ Vaciando el carrito con ID: ${cartId}`);
    
    const cart = await CartRepository.getById(cartId);
    if (!cart) {
        console.warn(`⚠️ No se encontró el carrito con ID: ${cartId}`);
        throw new Error("Carrito no encontrado");
    }

    cart.cartProducts = [];
    const updatedCart = await CartRepository.update(cartId, { cartProducts: [] });

    console.log("✅ Carrito vaciado correctamente en la base de datos.");
    return updatedCart;
  }

}

export default new CartService();
