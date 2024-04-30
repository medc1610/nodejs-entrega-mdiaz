import { Router } from 'express';
import { userModel } from '../models/user.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import passport from 'passport';


const sessionRouter = Router();


sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).send('Usuario o contraseña incorrectos')
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
        }

        res.status(200).send('Usuario logueado');
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
})


sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) {
            res.status(400).send('Usuario ya existe')
        }

        res.status(200).send('Usuario creado');

    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

// sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res => {}));

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name,
    }
    res.redirect('/api/products');
});

sessionRouter.get('/current', passport.authenticate('jwt',), (req, res) => {
    console.log(req)
    res.status(200).send('Usuario logueado');
})

sessionRouter.get('/testJWT', passport.authenticate('jwt', {session: false}), async (req, res) => {
    res.send(req.status(200).send(req.user));
})

export default sessionRouter;
