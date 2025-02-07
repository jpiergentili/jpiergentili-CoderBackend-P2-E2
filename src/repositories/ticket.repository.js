import TicketDAO from "../dao/mongo/ticket.dao.js";

class TicketRepository {
    async create(ticketData) {
        return await TicketDAO.create(ticketData);
    }

    async getById(id) {
        return await TicketDAO.getById(id);
    }
}

export default new TicketRepository();