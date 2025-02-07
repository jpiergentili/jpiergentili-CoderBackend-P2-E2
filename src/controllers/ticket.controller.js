import TicketService from "../services/ticket.service.js";

class TicketController {
    async createPurchase(req, res) {
        try {
            const { cid } = req.params;
            const userEmail = req.user.email;

            const ticket = await TicketService.createPurchase(cid, userEmail);
            if (!ticket) {
                return res.status(400).json({ error: "No se pudo completar la compra." });
            }

            res.redirect(`/ticket/${ticket._id}`);
        } catch (error) {
            console.error("Error en la compra:", error);
            res.status(500).json({ error: "Error al procesar la compra." });
        }
    }

    async getTicket(req, res) {
        try {
            const { tid } = req.params;
            const ticket = await TicketService.getTicketById(tid);
            if (!ticket) {
                return res.status(404).send("Ticket no encontrado.");
            }

            res.render("ticket", { ticket, user: req.user, title: "Comprobante de Compra" });
        } catch (error) {
            console.error("Error al cargar el ticket:", error);
            res.status(500).send("Error al cargar la página del ticket.");
        }
    }
}

export default new TicketController();
