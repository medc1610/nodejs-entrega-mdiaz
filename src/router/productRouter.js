import { Router } from 'express';
//import ProductManager from '../manager/ProductManager.js';
import ProductManager from '../dao/db/ProductManager.js';
import isAdmin from '../middlewares/isAdmin.js';
import isRolProductAdd from '../middlewares/isRolProductAdd.js';



const productManager = new ProductManager();

const router = Router();




router.get('/limit/:limit?/page/:page?/sort/:sort?/query/:query?',async (req,res,next) =>{
    try{
        const limit = req.params.limit;
        const page = req.params.page;
        const sort = req.params.sort;
        const query = req.params.query;
        const productos =  await productManager.getProducts(limit,page,sort,query);
        res.send(productos);
        return;
    }catch(e){        
        next(e);
    }
});

router.get('/:pid',async (req,res,next) =>{
    try{
        const id = req.params.pid;   
        const producto =  await productManager.getProductById(id);
        if(!producto.length){
            res.send({Error : `No existe el producto de id: ${id}`});
        }
        res.send(producto);
        return;
    }catch(e){
        next(e);
    }
});

router.post('/',isRolProductAdd, async (req,res,next) =>{
    try{
        productManager.validarDatos(req.body);
        if (req.session.role == 'premium'){
            req.body.owner = req.session.email;
        }
        const p = await productManager.addPoduct(req.body);

        const lista =  await productManager.getProducts();
        req.context.socketServer.emit('actualizarLista',lista);
        res.send(p);
        return;
    }catch(e){
        next(e);
    }
    
});

router.put('/:pid',isRolProductAdd,async (req,res,next) =>{
    try{ 
        const id = req.params.pid;
        let producto;
        if(req.session.role == 'premium'){
            producto =  await productManager.updateProductWithOwnerById(id,req.body,req.session.role);
        }else{
            producto =  await productManager.updateProductById(id,req.body);
        }
        if(!producto){
            res.status(400).send({Error : 'No se pudo agregar el producto'});
        }
        res.send(producto);
        return;
    }catch(e){
        next(e);
    }
});


router.delete('/:pid',isRolProductAdd,async (req,res,next) =>{
    try{
        const id = req.params.pid; 
        let fueEliminado;
        if(req.session.role == 'premium'){
            fueEliminado =  await productManager.deleteProductWithOwner(id);
        }else{
            fueEliminado =  await productManager.deleteProduct(id);
        }

        if(!fueEliminado){
            res.status(400).send({Error : `No existe el producto de id: ${id}`});
        }
        const lista =  await productManager.getProducts();
        req.context.socketServer.emit('actualizarLista',lista);
        res.send();
        return;
    }catch(e){
        next(e);
    }
});

export default router;