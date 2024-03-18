import {Router} from 'express';
import  productModel  from '../models/product.js';


const productsRouter = Router();

productsRouter.get('/', async (req, res) => {

    try {
        const {limit, page, filter, sort} = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const lim = limit !== undefined ? limit : 10;
        const order = sort !== undefined ? sort : 'asc';

        if(filter === 'true' || filter === 'false'){
            metFilter = 'status'
        } else if( filteer !== undefined){
            metFilter = 'category'
        }

        const query = metFilter ? { [metFilter]: filter } : {};
        const ordquery = order !== undefined ? `sort: { price : ${order}}`:""
        const products = await productModel.paginate(query, {limit:lim, page:pag, sort: ordquery});

        res.status(200).send(products.docs);
        // const prodsLimit = products.slice(0, limite);
        // res.render('templates/products', {
        //     mostrarProductos: true,
        //     prods: prodsLimit,
        //     css: 'home.css',
        // })
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }



});

productsRouter.get('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id);
        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`);

    }

})

productsRouter.post('/', async (req, res) => {

    try {
        const product = req.body;
        // const result = productManager.addProduct(product);
         const result =   await productModel.create(product);
       res.send(product);
    }
    catch (error) {

        res.status(500).send(`Error: ${error}`);
    }

});

productsRouter.put('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const product = req.body;
        const result = await productModel.findByIdAndUpdate(id, product);
        res.send(result);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

productsRouter.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const result = await productModel.findByIdAndDelete(id);
        res.send(result);
    }
    catch (error) {
        res.status(500).send(`Error: ${error}`);
    }

})

export default productsRouter;
