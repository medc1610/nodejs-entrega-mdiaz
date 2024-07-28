import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import LocalStrategy from 'passport-local';
import { userModel } from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'passport-jwt';
import config from './config.js';
import CartRepository from "../repositories/CartRepository.js"
import {logger} from '../utils/logger.js'



const cartRepository = new CartRepository();
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const exists = await userModel.findOne({ email: username });
          if (exists) {
            return done(null, false);
          }
          let role = undefined;
          if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            role = 'admin';
          }

          const neWCard = await cartRepository.addCart();

          const user = await userModel.create({
            first_name,
            last_name,
            age,
            email: username,
            cart : neWCard._id,
            role,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          });
          req.session.isLogged = false;
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
          }

          logger.info(`usuario con rol de ${user.role} logeado`);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );


  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: config.github_callback_url,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await userModel.findOne({ email });
          if (!user) {
            const neWCard = await cartRepository.addCart();
            const newUser = await userModel.create({
              first_name: profile._json.name,
              last_name: '',
              age: 18,
              password: '',
              email,
              cart : neWCard._id,
            });

            done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwt_sercret,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });



};

export default initializePassport;
