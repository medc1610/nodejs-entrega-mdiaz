import { ticketModel } from "../dao/models/ticket.model.js";

export default class TicketRepository{
    
    async addticket(data){
        const cart = await ticketModel.create(data);      
        return cart;
    }
}