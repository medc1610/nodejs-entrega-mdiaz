import { Router } from 'express';
//import CartManager from '../dao/FileSystem/CartManager.js';
import CartManager from '../dao/db/CartManager.js';
import isUser from '../middlewares/isUser.js';

const cartManager = new CartManager();

const router = Router();

router.post('/',async (req,res,next) =>{
    try{ 
        const cart = await cartManager.addCart();
        res.send(cart);
    }catch(e){
        next(e);
    }
});

router.post('/:cid/product/:pid',async (req,res,next) =>{
    try{ 
        const cid = req.params.cid;        
        const pid =req.params.pid;
        const resp = await cartManager.addProductIntoCart(cid,pid);
     
        res.send(resp);     
        
    }catch(e){
        
        next(e);
    }
});

router.get('/:cid',isUser,async (req,res,next) =>{
    try{ 
        
        const id = req.params.cid;
        const carrito = await cartManager.getCartPopulateById(id);
        res.send(carrito);
    }catch(e){
        next(e);
    }
});

router.delete('/:cid/product/:pid',async (req,res,next) =>{
    try{ 
        
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        const cart = await cartManager.deleteProductByCart(idCart,idProduct);
        res.send(cart);
    }catch(e){
        next(e);
    }
});

router.delete('/:cid',async (req,res,next) =>{
    try{ 
        
        const idCart = req.params.cid;
        const cart = await cartManager.deleteAllProductByCart(idCart);
        res.send(cart);
    }catch(e){
        next(e);
    }
});

router.put('/:cid',async (req,res,next) =>{
    try{ 
        
        const idCart = req.params.cid;
        const data = req.body.products
        const cart = await cartManager.updateProductsByCart(idCart,data);
        res.send(cart);
    }catch(e){
        next(e);
    }
});

router.put('/:cid/product/:pid',async (req,res,next) =>{
    try{ 
        
        const idCart = req.params.cid;        
        const idProduct = req.params.pid;
        const data = req.body.quantity;
        const cart = await cartManager.updateQuantityProductsByCart(idCart,idProduct,data);
        res.send(cart);
    }catch(e){
        next(e);
    }
});

router.put('/:cid/purchase',isUser,async (req,res,next) =>{
    try{ 
        
        const idCart = req.params.cid;
        const emailSend = req.session.email;
        const cart = await cartManager.purchaseCart(idCart,emailSend);
        res.send(cart);
    }catch(e){
       next(e);
    }
});

export default router;