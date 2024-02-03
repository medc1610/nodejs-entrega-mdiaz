import express from 'express';
import { ProductManager } from './ProductManager.js';

const app = express();
const PORT = 8080;
const productManager = new ProductManager('./src/ejemplo.json');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/productos', (req, res) => {
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

app.get('/productos/:id', (req, res) => {
    const {id} = req.params;
    const product = productManager.getProductById(id);
    res.send(product);
})

