import express from 'express';
import handlebars from  'express-handlebars'
import viewsRouter from './viewsRouter.js';
import productRouter from './productRouter.js';
import cartRouter from './cartRouter.js';
import realtimerouter from './realTimeRouter.js';
import chatrouter from './chatRouter.js';
import sessionRouter from './sessionRouter.js';
import initializePassport from '../config/passport.config.js';
import passport from 'passport';
import mockProduct from './mockProductRouter.js';
import usersrouter from './userRouter.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import {fileURLToPath} from 'url';
import { dirname } from 'path';


const router = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.engine('handlebars',handlebars.engine());
router.set('views','./src/views');
router.set('view engine', 'handlebars');


const swaggerOptions = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: 'Documentación',
        description: 'Documentación',
      },
    },
    apis: [`${__dirname}/../docs/**/*.yaml`],
};
  
const specs = swaggerJsdoc(swaggerOptions);
router.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


router.use('/api/products', productRouter);
router.use('/api/carts', cartRouter);
router.use('/', viewsRouter);
router.use('/realtimeproducts', realtimerouter);
router.use('/', chatrouter);
router.use('/api/session', sessionRouter);
router.use('/', mockProduct);
router.use('/api/users', usersrouter);


initializePassport();
router.use(passport.initialize());
router.use(passport.session());

export default router;