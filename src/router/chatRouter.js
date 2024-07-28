import { Router } from 'express';
//import MessageManager from '../dao/db/ChatManager.js';
//const messageManager = new MessageManager();
import isUser from '../middlewares/isUser.js';

const router = Router();

router.get('/chat',isUser, (req, res) => res.render('chat', {}));


export default router;