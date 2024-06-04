import { Router } from 'express';
import { getUsers, updateUserPremiumRoleById } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.post('/updateUser', updateUserPremiumRoleById)

export default userRouter;
