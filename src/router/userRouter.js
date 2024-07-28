import { Router } from 'express';
import UserManager from '../dao/db/UserManager.js'
import isPremium from '../middlewares/isPremium.js';
import {uploader} from '../middlewares/multer.js'
import isAdminGlobal from '../middlewares/isAdmingGlobal.js';

const sessionRouter = Router();
const userManager = new UserManager();


sessionRouter.put('/premium/:id', async (req, res,next) =>{ 
    try{
        const id = req.params.id;
        console.log(id);
        const resp = await userManager.updateUserPremiumRoleById(id);
        res.send(resp);
        return;
    }catch(e){        
        next(e);
    }
});

sessionRouter.post('/:uid/documents', 
    uploader.fields([
        { name: 'identification', maxCount: 1 },
        { name: 'proof_of_address', maxCount: 1 },
        { name: 'proof_of_status', maxCount: 1 }
    ]),
    async (req, res,next) => {
        try{
            const id = req.params.uid;
            const lista = [];
            for (let key in req.files) {
                req.files[key].forEach(item => {
                    lista.push({
                    name : item.fieldname,
                    reference : item.path
                    });
                });
            }


            const documents =  await userManager.getDocuments(id);

            for (let item of lista) {
                let exists = documents.some(obj => obj.name === item.name);
                if (!exists) {
                    documents.push(item);
                }
            }

            await userManager.updateDocuments(id,documents);
        
            res.send();
            return
        }catch(e){        
            next(e);
        }
});


sessionRouter.get('/', async (req, res,next) =>{ 
    try{
        const resp = await userManager.getAllUsers();
        res.send(resp);
        return;
    }catch(e){        
        next(e);
    }
});

sessionRouter.delete('/', async (req, res,next) =>{ 
    try{
        const resp = await userManager.deleteAllUsers();
        res.send(resp);
        return;
    }catch(e){        
        next(e);
    }
});


sessionRouter.delete('/:email',isAdminGlobal, async (req, res,next) =>{ 
    try{
        const email = req.params.email;
        const resp = await userManager.deleteUserByEmail(email);
        res.send(resp);
        return;
    }catch(e){        
        next(e);
    }
});

export default sessionRouter;
