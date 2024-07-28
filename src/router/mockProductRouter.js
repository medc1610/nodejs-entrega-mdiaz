import { Router } from 'express';
import ProductDTO from '../dto/productDTO.js';

const dtoProduct = new ProductDTO();
const router = Router();

router.get('/mockingproducts',async (req,res) =>{
    try{
        const products =  dtoProduct.getMockProducts();
        res.send(products);
    }catch(e){        
        res.status(500).send();
    }
});

export default router;
