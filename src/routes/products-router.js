import {Router} from 'express';
import {ProductManager} from "../config/ProductManager.js";
import  productModel from '../models/product.js';

const productManager = new ProductManager('./src/data/products.json');

const productsRouter = Router();


productsRouter.get('/', (req, res) => {
    const {limit} = req.query;
    // const products = productManager.getProducts();
    const products = productModel.find();
    if (limit) {
        if (parseInt(limit)) {
            const prodsLimit = products.slice(0, limit);
            res.render('templates/products', {
                mostrarProductos: true,
                prods: prodsLimit,
                css: 'home.css',
            })
        } else {
            res.send("No se encontraron productos")
        }
    } else {
        res.render('templates/products', {

            mostrarProductos: true,
            prods: products,
            css: 'home.css',
        })

    }

});

productsRouter.get('/:id', (req, res) => {
    const {id} = req.params;
    // const product = productManager.getProductById(id);
    const product = productModel.findById(id);
    res.send(product);
})

productsRouter.post('/', (req, res) => {
    console.log(req.body)
    const product = req.body;
    // const result = productManager.addProduct(product);
    const result = productModel.create(product);
    res.send(result);
});

productsRouter.put('/:id', (req, res) => {
    const {id} = req.params;
    const product = req.body;
    // const result = productManager.putProductById(id, product);
    const result = productModel.findByIdAndUpdate(id, product);
    res.send(result);
});

productsRouter.delete('/:id', (req, res) => {
    const {id} = req.params;
    // const result = productManager.deleteProductById(id);
    const result = productModel.findByIdAndDelete(id);
    res.send(result);
})

export default productsRouter;
