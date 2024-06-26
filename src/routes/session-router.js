import { Router } from 'express';
import {
    login,
    register,
    sessionGithub,
    testJWT,
    logout,
    changePassword,
    sendEmailPassword
} from '../controllers/sessionController.js';
import passport from 'passport';


const sessionRouter = Router();


sessionRouter.post('/login', passport.authenticate('login'), login)

sessionRouter.post('/register', passport.authenticate('register'), register);

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email'] }), async (req, res) => {});

sessionRouter.get('/githubSession', passport.authenticate('github'), sessionGithub);

sessionRouter.get('/logout', logout)

sessionRouter.get('/testJWT', passport.authenticate('jwt', {session: false}), testJWT)

sessionRouter.get('/sendEmailPassword', sendEmailPassword )

sessionRouter.post('/reset-password/:token', changePassword)


export default sessionRouter;
