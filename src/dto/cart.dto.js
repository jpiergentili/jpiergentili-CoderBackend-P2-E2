class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.first_name = cart.first_name;
        this.last_name = cart.last_name;
        this.cartProducts = cart.cartProducts.map(product => ({
            productId: product.product._id,
            title: product.product.title,
            price: product.product.price,
            quantity: product.qty
        }));
    }
}

export default CartDTO;