import express from 'express';
import productRouter from './routes/products-router.js';
import cartRouter from './routes/cart-router.js';
import chatRouter from './routes/chat-router.js';
import userRouter from './routes/user-router.js';
import sessionRouter from './routes/session-router.js';
import varenv from './dotenv.js';
import { engine } from 'express-handlebars'
import { Server } from 'socket.io';
import { __dirname } from './path.js'
import upload from './config/multer.js';
import mongoose from 'mongoose';
import { messageModel } from './models/messages.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport/passport.js';
import passport from 'passport';


const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const io = new Server(server);


mongoose.connect(varenv.MONGO_BD_URL)
    .then(() => console.log('Conectado MongoDB'))
    .catch(error => console.log(error))

// const resultado = await orderModel.paginate({status:true}, {page: 1, limit: 10, sort: {price:'desc'}});

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    if (email == "admin@admin.com" && password == "1234") {
        req.session.email = email;
        req.session.password = password;
        return res.send('Usuario logueado')
    }
})

io.on('connection', (socket) => {
    console.log('conexión con socket.io');

    socket.on('mensaje', mensaje => {
        messageModel.create(mensaje);
        const mensajes = messageModel.find();
        io.sockets.emit('mensajes', mensajes);

    })

});

app.use(express.json());


app.use(session({
    secret: varenv.SESSION_SECRET,
    resave: true,
    store: MongoStore.create({
        mongoUrl:  varenv.MONGO_BD_URL,
        ttl: 600

    }),
    saveUninitialized: true
}))
app.use(cookieParser(varenv.COOKIE_SECRET));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


initializePassport()
app.use(passport.initialize());
app.use(passport.session());


app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products/', productRouter, express.static(__dirname + '/public'));
app.use('/api/cart/', cartRouter);
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'));
app.use('/api/user', userRouter);
app.use('/api/session', sessionRouter);
app.use(session())

//cookies
app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'cookie', {maxAge: 3000000, signed: true}).send('Cookie seteada')
});

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
});

app.get('/deleteCookie', (req, res) => {
    res.clearCookie('CookieCookie', '', {expires: new Date(0)})
});

//sessions
app.get('/setSession', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Has visitado esta página ${req.session.counter} veces`)
    } else {
        req.session.counter = 1;
        res.send("sos el primer usuario en ingresar")
    }
});

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


