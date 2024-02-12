import express from 'express';
import productRouter from './routes/products-router.js';
import cartRouter from './routes/cart-router.js';

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());

app.use('/products', productRouter);

app.use('/cart', cartRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
})


