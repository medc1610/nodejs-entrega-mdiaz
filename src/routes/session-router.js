import { Router } from 'express';
import {login, register, sessionGithub, testJWT, logout} from '../controllers/sessionController.js';
import passport from 'passport';


const sessionRouter = Router();


sessionRouter.get('/login', passport.authenticate('login'), login)


sessionRouter.post('/register', passport.authenticate('register'), register);

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email'] }), async (req, res) => {});

sessionRouter.get('/githubSession', passport.authenticate('github'), sessionGithub);

sessionRouter.get('/logout', logout)

sessionRouter.get('/testJWT', passport.authenticate('jwt', {session: false}), testJWT)

// sessionRouter.get('/current', passport.authenticate('jwt',), (req, res) => {
//     console.log(req)
//     res.status(200).send('Usuario logueado');
// })

export default sessionRouter;
