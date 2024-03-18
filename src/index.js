import express from 'express';
import productRouter from './routes/products-router.js';
import cartRouter from './routes/cart-router.js';
import chatRouter from './routes/chat-router.js';
import userRouter from './routes/user-router.js';
import { engine } from 'express-handlebars'
import { Server } from 'socket.io';
import { __dirname } from './path.js'
import upload from './config/multer.js';
import mongoose from 'mongoose';
import { messageModel } from './models/messages.js';
import orderModel from 'mongoose-paginate-v2';


const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const io = new Server(server);


mongoose.connect("mongodb+srv://medc1610:medc123456@cluster0.v6ayc2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Conectado MongoDB'))
    .catch(error => console.log(error))


io.on('connection', (socket) => {
    console.log('conexión con socket.io');

    socket.on('mensaje', mensaje => {
        messageModel.create(mensaje);
        const mensajes = messageModel.find();
        io.sockets.emit('mensajes', mensajes);

    })

});

app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products/', productRouter, express.static(__dirname + '/public'));
app.use('/api/cart/', cartRouter);
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'));
app.use('/api/user', userRouter);


app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        res.status(500).send("Error al cargar imagen")
    }
})

// app.get('/static', (req, res) => {
//     const prods = [
//         {id: 1, title: "producto1", price: 7500, img: "https://definicion.de/wp-content/uploads/2009/06/producto.png"},
//         {id: 2, title: "producto2", price: 10000, img: "https://definicion.de/wp-content/uploads/2009/06/producto.png"},
//         {id: 3, title: "producto3", price: 3500, img: "https://definicion.de/wp-content/uploads/2009/06/producto.png"},
//         {id: 4, title: "producto4", price: 48000, img: "https://definicion.de/wp-content/uploads/2009/06/producto.png"}
//     ]
//
//     res.render('templates/products', {
//         mostrarProductos: true,
//         prods: prods,
//         css: 'home.css',
//     })
// });


