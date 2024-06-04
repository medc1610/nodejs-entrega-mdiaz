import { sendEmailChangePassword } from '../utils/nodemailer.js';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';

export const login = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).send('Usuario o contraseña incorrectos')
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
        }
        res.logger.info(`Usuario logueado correctamente: ${req.user.email} - ${new Date().toLocaleDateString()}`)
        res.status(200).send('Usuario logueado');
    } catch (error) {
        res.logger.error(`Error al loguear el usuario ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            res.logger.warning(`Usuario ya existe - ${new Date().toLocaleDateString()}`)
            res.status(400).send('Usuario ya existe')
        }
        res.logger.info(`Usuario creado correctamente: ${req.user.email} - ${new Date().toLocaleDateString()}`)
        res.status(200).send('Usuario creado');

    } catch (error) {
        res.logger.error(`Error al crear el usuario ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}

export const logout = async (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e);
        } else {
            res.redirect('/');
        }
    })
}


export const sessionGithub = async (req, res) => {
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name,
    }
    res.redirect('/api/products');
}

export const testJWT = async (req, res) => {
    if (req.user.role === 'user') {
        res.status(403).send('Usuario no autorizado')
    } else {
        res.status(200).send(req.user);
    }

}

export const changePassword = async (req, res) => {
    const {token} = req.params;
    const { newPassword } = req.body;

    try {
        const validateToken = jwt.verify(token.substring(0,6), "coder");
        const user = userModel.findOne({email: validateToken.userEmail});
        if(user){
           if(!validatePassword(newPassword, user.password)){
               user.password = await createHash(newPassword);
              const resultado = await userModel.findOneAndUpdate(user._id, user);
                res.status(200).send(resultado);
           } else {
                res.status(400).send('Contraseña igual a la anterior');
            }
        } else {
            res.status(404).send('Usuario no encontrado');
        }

    }catch (error) {
        res.status(500).send(`Error: ${error}`);

    }
}

export const sendEmailPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await userModel.find({email: email});

        if (user) {
            const token = jwt.sign({userEmail:email}, "coder", {expiresIn: '1h'})
            const resetLink = `http://localhost:8080/api/session/resetpasswprd?token=${token}`
            await sendEmailChangePassword(email, resetLink)
            res.status(200).send('Email enviado');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}
