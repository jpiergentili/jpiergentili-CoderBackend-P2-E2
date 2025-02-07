import TicketModel from "../models/ticket.model.js";

class TicketDAO {
    async create(ticketData) {
        return await TicketModel.create(ticketData);
    }

    async getById(id) {
        return await TicketModel.findById(id).populate("products.product");
    }
}

export default new TicketDAO();
