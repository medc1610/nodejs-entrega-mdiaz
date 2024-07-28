import { Router } from 'express';
//import ProductManager from '../manager/ProductManager.js';

import ProductManager from '../dao/db/ProductManager.js';
const productManager = new ProductManager();

const router = Router();

router.get('/', async (req, res) =>{
    req.context.socketServer.emit();
    const products = await productManager.getProducts();

    res.render('realTimeProducts', {products});
});

export default router;