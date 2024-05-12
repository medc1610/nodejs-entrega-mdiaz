import { cartModel } from '../models/cart.js';

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.id;
        const cart = await cartModel.findById(cartId);
        res.send(cart);
    }
    catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}

export const createCart = async (req, res) => {
    try {
        const body = req.body;
        const cart = await cartModel.create(body);
        res.send(cart);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}

export const insertProductCart = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const {quantity} = req.body;
        const cart = await cartModel.findById(cid);

        const indice = cart.products.findIndex(prod => prod.idProduct === pid);

        if (indice !== -1) {
            cart.products[indice].quantity += quantity;
        } else {
            cart.products.push({idProduct: pid, quantity: quantity});
        }
        const mensaje = await cartModel.findByIdAndUpdate(cid, cart);
        res.send(mensaje);
    }
    catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}

