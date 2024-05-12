import { cartModel } from '../models/cart.js';
import productModel from '../models/product.js';

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.id;
        const cart = await cartModel.findById(cartId);
        res.send(cart);
    } catch (error) {
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
    try {
        if(req.user.role === 'Admin'){
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
            res.status(200).send(mensaje);
        } else {
            res.status(403).send('Usuario no autorizado');
        }

    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}

export const createTicket = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId)
        let prodSinStock = [];
        if (cart) {
            cart.products.forEach(prod => {
                let producto = productModel.findById(prod.idProduct);
                if (producto.stock - prod.quantity < 0) {
                    prodSinStock.push(producto);
                }
            });
            if (prodSinStock.length === 0) {
                cart.products.forEach(prod => {
                    let producto = productModel.findById(prod.idProduct);
                    producto.stock -= prod.quantity;
                    productModel.findByIdAndUpdate(prod.idProduct, producto);
                });
                res.status(200).send('Compra realizada');
            } else {
                let cart = cartModel.findById(cartId);
                cart.products = cart.products.filter(prod => !prodSinStock.includes(prod.idProduct));
                cartModel.findByIdAndUpdate(cartId, cart);
                res.status(400).send('No hay stock suficiente de los siguientes productos: ' + prodSinStock);
            }

        } else {
            res.status(404).send('Carrito no existe');
        }

    } catch (e) {
        res.status(500).send(e);
    }
}
