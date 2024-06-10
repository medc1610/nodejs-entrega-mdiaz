import { Router } from 'express';
import { getUsers, updateUserPremiumRoleById } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.put('/updateUser/:id', updateUserPremiumRoleById)

export default userRouter;
