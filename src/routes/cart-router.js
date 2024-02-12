import {Router} from 'express';
import {CartManager} from "../CartManager.js";

const cartManager = new CartManager('./src/data/cart.json');
const cartRouter = Router();


cartRouter.post('/', (req, res) => {
    const body = req.body;
    const cart = cartManager.addCart(body);
    res.send(cart);
})

cartRouter.post('/:cid/products/:pid', (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const cart = cartManager.addProduct(cid, pid);
    res.send(cart);
})

cartRouter.get('/', (req, res) => {
    const carts = cartManager.getCarts();
    res.send(carts);
})

cartRouter.get('/:id', (req, res) => {
    const {id} = req.params;
    const cart = cartManager.getCartById(id);
    res.send(cart);
})

export default cartRouter