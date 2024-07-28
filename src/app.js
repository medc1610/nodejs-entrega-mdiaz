import express from 'express';
import { Server } from 'socket.io';
import chatSocket from './socket/chatSocket.js';
import config from './config/config.js';
import router from './router/appRouter.js'
import Conection from './dao/connect/conection.js';
import customError from './middlewares/errors/errorMiddleware.js';
import { logger } from './utils/logger.js';

const conection = new Conection();
const app = express()
const httpServer = app.listen(config.port, () => logger.info(`levantado`));
const socketServer = new Server(httpServer);




app.use(
  conection.sessionMongo()
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

app.use((req,res,next)=>{
    req.context = {socketServer};
    next();
});


app.use(router);
app.use(customError);





socketServer.on('connection', (socket) => {
    console.log('cliente conectado');    
});

chatSocket(socketServer);

