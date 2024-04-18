import { Router } from 'express';

import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from '../controllers/productController.js';

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {

    try {
        const {limit, page, filter, sort} = req.query;
        const prods = await getProducts(filter, limit, page, sort);

        res.status(200).send(products.docs);
        // const prodsLimit = products.slice(0, limite);
        // res.render('templates/products', {
        //     mostrarProductos: true,
        //     prods: prodsLimit,
        //     css: 'home.css',
        // })
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }


});

productsRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await getProduct(id)
        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`);

    }

})

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body;
        const result = createProduct(product);
        res.send(result);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

productsRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = req.body;
        const result = updateProduct(id, product)
        res.send(result);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

productsRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = deleteProduct(id)
        res.send(result);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }

})

export default productsRouter;
