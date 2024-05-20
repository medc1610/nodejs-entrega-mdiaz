import { Router } from 'express';
import { addMockProducts } from '../controllers/productController.js';

const mockRouter = Router();

mockRouter.get('/mockingproducts',async (req,res) =>{
    try{
        res.send(addMockProducts);
    }catch(e){        
        res.status(500).send();
    }
});

export default mockRouter;
