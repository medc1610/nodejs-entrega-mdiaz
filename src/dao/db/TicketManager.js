
import { v4 } from 'uuid';

import TicketRepository from "../../repositories/TicketRepository.js" 

const ticketRepository = new TicketRepository();

export default class TicketManager{
   
    async addTicket(cart,text){
        let precioTotal = 0;

        cart.forEach(products => {
            precioTotal = products.product.price * products.quantity;
        });
        const ticketDTO = {
            code : v4(),
            amount : precioTotal,
            puchaser : text
        }       
        
        const ticket = await ticketRepository.addticket(ticketDTO);
        return ticket;
       
    }
}


