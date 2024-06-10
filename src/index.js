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
import multerRouter from './routes/multer-router.js';
import mongoose from 'mongoose';
import { messageModel } from './models/messages.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport/passport.js';
import passport from 'passport';
import mockRouter from './routes/mock-product-router.js';
import {addLogger} from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';
// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     port: 587,
//     auth: {
//         user:"medc1610@gmail.com",
//         pass:
//     }
// })

const app = express();
app.use(addLogger);
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



const io = new Server(server);


mongoose.connect(varenv.MONGO_DB_URL)
    .then(() => console.log('Conectado MongoDB'))
    .catch(error => console.log(error))

app.get('/', (req, res) => {
    req.logger.fatal("fatal")
    req.logger.error("error")
    req.logger.warning("warning")
    req.logger.http("http")
    req.logger.debug("debug")
    req.logger.info("info")

});

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentación de mi aplicación',
            description: 'Descripción de mi aplicación',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use ('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

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
        mongoUrl:  varenv.MONGO_DB_URL,
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
app.use('/api/products', productRouter, express.static(__dirname + '/public'));
app.use('/api/cart', cartRouter);
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'));
app.use('/api/user', userRouter);
app.use('/api/session', sessionRouter);
app.use('/upload', multerRouter)
app.use('/', mockRouter)
// app.use(session())

app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'cookie', {maxAge: 3000000, signed: true}).send('Cookie seteada')
});

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
});

app.get('/deleteCookie', (req, res) => {
    res.clearCookie('CookieCookie', '', {expires: new Date(0)})
});

app.get('/setSession', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Has visitado esta página ${req.session.counter} veces`)
    } else {
        req.session.counter = 1;
        res.send("sos el primer usuario en ingresar")
    }
});

