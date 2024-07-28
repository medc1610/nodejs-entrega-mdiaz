import { Router } from 'express';
import config from '../config/config.js';

const router = Router();

router.get('/login', (req, res) => {
  if (req.session.isLogged) {
    return res.redirect('/profile');
  }
  const host = config.host;
  res.render('login',{host});
});



router.get('/signup', (req, res) => {
  if (req.session.isLogged) {
    return res.redirect('/profile');
  }

  const host = config.host;
  res.render('signup',{host});
});

router.get('/profile', (req, res) => {
  if (!req.session.isLogged) {
    return res.redirect('/login');
  }

  const { username, email } = req.session;
  
  const host = config.host;
  res.render('profile', { username, email,host });
});

export default router;
