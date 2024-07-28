import { mensajeModel } from "../models/Message.model.js";

export default class MessageManager{

    async agregarMensaje(data) {      
       
        const mensaje = await mensajeModel.create(data);
        return mensaje;       
    }
   
    async getMensajes(){
        const mensajes = await mensajeModel.find().lean();
        return mensajes; 
    }
}