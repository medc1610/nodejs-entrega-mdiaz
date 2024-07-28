import MessageManager from '../dao/db/ChatManager.js';
const chat = new MessageManager();

const chatEvents = (socketServer) => {
    socketServer.on('connection', (socket) => {
      socket.on('mensaje', async (data) => {
        await chat.agregarMensaje(data);
        const mensajes = await chat.getMensajes();
        socketServer.emit('nuevo_mensaje', mensajes);
      });
      socket.on('inicio', async () => {
        const mensajes = await chat.getMensajes();
        socketServer.emit('nuevo_mensaje', mensajes);
      });
    });
  };
  
  export default chatEvents;