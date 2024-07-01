import { Router } from 'express';
import { getUsers, sendDocument, updateUserPremiumRoleById } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.put('/updateUser/:id', updateUserPremiumRoleById)

userRouter.put('/:uid/documents', sendDocument);

export default userRouter;
