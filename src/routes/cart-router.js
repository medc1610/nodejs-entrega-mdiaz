import { Router } from 'express';
import { cartModel } from '../models/cart.js';
import { getCart, insertProductCart, createCart, createTicket } from '../controllers/cartController.js';
import passport from 'passport';

const cartRouter = Router();


cartRouter.post('/', getCart)

cartRouter.post('/:cid/:pid', createCart)

cartRouter.post('/:id',passport.authenticate('jwt', {session: false}), insertProductCart)

cartRouter.post('/:cid/purchase', createTicket);

cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find();
        res.logger.info(`Se obtuvieron los carritos correctamente: ${carts} - ${new Date().toLocaleDateString()}`)
        res.status(200).send(carts);
    } catch (error) {
        req.logger.error(`Error al eliminar el producto ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
})

cartRouter.put('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const productsToUpdate = req.body.products;
        const cart = await cartModel.findById(cid);

        productsToUpdate.forEach(productToUpdate => {
            const productIndex = cart.products.findIndex(prod => prod.idProduct === productToUpdate.idProduct);

            if (productIndex !== -1) {
                cart.products[productIndex] = { ...cart.products[productIndex], ...productToUpdate };
            }
        });

        await cartModel.findByIdAndUpdate(cid, cart);
        res.logger.info(`Carrito actualizado correctamente: ${cart} - ${new Date().toLocaleDateString()}`)
        res.send({ message: 'Products updated' });
    } catch (error) {
        res.logger.error(`Error al actualizar el carrito ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
});

cartRouter.put('/:cid/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const productToUpdate = req.body;
        const cart = await cartModel.findById(cid);

        const productIndex = cart.products.findIndex(prod => prod.idProduct === pid);

        if (productIndex !== -1) {
            cart.products[productIndex] = { ...cart.products[productIndex], ...productToUpdate };
            await cartModel.findByIdAndUpdate(cid, cart);
            res.logger.info(`Producto actualizado correctamente: ${cart} - ${new Date().toLocaleDateString()}`)
            res.send({ message: 'Product updated' });
        } else {
            res.logger.warning(`Producto no encontrado - ${new Date().toLocaleDateString()}`)
            res.status(404).send({ message: 'Product not found in cart' });
        }
    } catch (error) {
        res.logger.error(`Error al actualizar el producto ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
});


cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartModel.findById(cid);

        const productIndex = cart.products.findIndex(prod => prod.idProduct === pid);

        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            await cartModel.findByIdAndUpdate(cid, cart);
            res.logger.info(`Producto eliminado correctamente: ${cart} - ${new Date().toLocaleDateString()}`)
            res.send({ message: 'Product removed from cart' });
        } else {
            res.logger.warning(`Producto no encontrado - ${new Date().toLocaleDateString()}`)
            res.status(404).send({ message: 'Product not found in cart' });
        }
    } catch (error) {
        res.logger.error(`Error al eliminar el producto ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
});

cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartModel.findById(cid);

        cart.products = [];
        await cartModel.findByIdAndUpdate(cid, cart);
        res.logger.info(`Todos los productos eliminados correctamente: ${cart} - ${new Date().toLocaleDateString()}`)
        res.send({ message: 'All products removed from cart' });
    } catch (error) {
        res.logger.error(`Error al eliminar todos los productos ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
});

export default cartRouter
