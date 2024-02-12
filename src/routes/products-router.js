import {Router} from 'express';
import {ProductManager} from "../ProductManager.js";

const productManager = new ProductManager('./src/data/products.json');

const productsRouter = Router();


productsRouter.get('/', (req, res) => {
    const {limit} = req.query;
    const products = productManager.getProducts();
    if (limit) {
        if (parseInt(limit)) {
            const prodsLimit = products.slice(0, limit);
            res.send(prodsLimit)
        } else {
            res.send("No se encontraron productos")
        }
    } else {
        res.send(products)
    }

});

productsRouter.get('/:id', (req, res) => {
    const {id} = req.params;
    const product = productManager.getProductById(id);
    res.send(product);
})

productsRouter.post('/', (req, res) => {
    console.log(req.body)
    const product = req.body;
    const result = productManager.addProduct(product);
    res.send(result);
});

productsRouter.put('/:id', (req, res) => {
    const {id} = req.params;
    const product = req.body;
    const result = productManager.putProductById(id, product);
    res.send(result);
});

productsRouter.delete('/:id', (req, res) => {
    const {id} = req.params;
    const result = productManager.deleteProductById(id);
    res.send(result);
})

export default productsRouter;
