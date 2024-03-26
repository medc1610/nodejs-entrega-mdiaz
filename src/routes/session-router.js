import { Router } from 'express';
import { userModel } from '../models/user.js';
import userRouter from './user-router.js';


const sessionRouter = Router();


sessionRouter.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email: email});

        if (user && password === user.password) {
            res.status(200).send('Usuario logueado')
            req.session.email = email;
        } else {
            res.status(401).send('Usuario o contraseña incorrecta')
        }
    } catch (e) {
        res.status(500).send('Error al loguear usuario', e)
    }
})

sessionRouter.post('/register', async (req, res) => {
    try {
        const {nombre, apellido, password, edad, email} = req.body;
        const findUser = await userModel.findOne({email: email});
        if(findUser){
            res.status(400).send('Usuario ya registrado')
        } else {
           await userModel.create({nombre, apellido, password, edad, email});
            res.status(200).send("Usuario creado");
        }


        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});
