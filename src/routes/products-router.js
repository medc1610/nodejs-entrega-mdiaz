import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from '../controllers/productController.js';

const productsRouter = Router();

productsRouter.get('/', getProducts);

productsRouter.get('/:id', getProduct)

productsRouter.post('/post', createProduct);

productsRouter.put('/put/:id', updateProduct);

productsRouter.delete('/delete/:id', deleteProduct)

export default productsRouter;
