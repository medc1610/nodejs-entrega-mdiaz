import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import UserManager from '../dao/db/UserManager.js'
import config from '../config/config.js';

import isLogged from '../middlewares/isLogged.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserDTO from '../dto/userDTO.js';

const sessionRouter = Router();
const userManager = new UserManager();

sessionRouter.post('/login',isLogged,
  passport.authenticate('login', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.email = req.user.email;
    req.session.age = req.user.age;
    req.session.cart = req.user.cart;
    req.session.role = req.user.role;
    req.session.isLogged = true;
    //res.send();
    await userManager.updateLastConnection(req.user.email);
    let isAdmin = false;
  
    if (req.session.email == 'adminCoder@coder.com'){
      isAdmin = true;
    }
    const usermane = req.session.first_name;
    
    const host = config.host;
    res.render('menu', { isAdmin,usermane,host});
    //res.redirect('/products');
});





sessionRouter.post('/signup',isLogged,
  passport.authenticate('register', { failureRedirect: '/signup' }),
  async (req, res) => {
    res.redirect('/login');
  }
);

sessionRouter.get('/logout', async (req, res) => {  
  await userManager.updateLastConnection(req.session.email);
  req.session.destroy();
  res.redirect('/login');
});



sessionRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

sessionRouter.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    req.session.user = req.user.first_name;      
    req.session.cart = req.user.cart;  
    req.session.isLogged = true;
    res.redirect('/products');
  }
);

sessionRouter.get(
  '/currentjwt',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

sessionRouter.get(
  '/current',
  (req, res) => {
    const userDto = new UserDTO(req.session);
    res.send(userDto.getUser());
  }
);

sessionRouter.get('/loginjwt', 
  async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email});
    
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        { first_name: user.first_name, mail: user.email },
          '4Np)=advb(85/Bb!+',
        {
          expiresIn: '24h',
        }
      );
      res
        .cookie('token', token, {
          maxAge: 100000,
          httpOnly: true,
        })
        .send('Logeado');
    }else{
      res.send('no logeado');
    }
});

sessionRouter.get('/cookies', (req, res) =>{ 
  res.send(req.headers.cookie);
});


sessionRouter.post('/restablecerpass/:token',async (req, res,next) =>{ 
  try{
    const token = req.params.token;
    const decoded = jwt.verify(token, '4Np)=advb(85/Bb!+');

    const email = decoded.email;

    // Verificar la expiración del token
    if (decoded.exp) {
      const expiracion = new Date(decoded.exp * 1000); // Convertir a milisegundos
      const ahora = new Date();

      if (expiracion <= ahora) {
        // El token ha expirado
        res.redirect('/login');
      } else {

        // El token sigue siendo válido
        const { newPass } = req.body;
        const resp = await userManager.updatePassByEmail(email,newPass);
        if(resp == -1){
          // si el cliente usa la misma password
          const error = true;
          
          const host = config.host;
          res.render('restablecerPass', {token,error,host});
          return;
        }
        if(!resp){
          res.send('nose pudo cambiar la pass');     
        }else{
          res.redirect('/login');
        }
        return;
      }
    }   
    res.redirect('/login');
    return;
  }catch(e){
    next(e);
  }
});


sessionRouter.post('/recuperarpass',async (req, res) =>{ 
  const email = req.body.email;
  const token = jwt.sign(
    { email},
      '4Np)=advb(85/Bb!+',
    {
      expiresIn: '1h',
    }
  );
    
  res.cookie('token', token, {
      maxAge: 600000,
      httpOnly: true,
  }).redirect('/RestablecerPass');  
  
  return;
});


export default sessionRouter;
