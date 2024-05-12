import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from '../controllers/productController.js';
import passport from 'passport';

const productsRouter = Router();

productsRouter.get('/', getProducts);

productsRouter.get('/:id', getProduct)

productsRouter.post('/', passport.authenticate('jwt', {session: false}), createProduct);

productsRouter.put('/:id', updateProduct);

productsRouter.delete('/:id', deleteProduct)

export default productsRouter;
