import local from 'passport-local';
import passport from 'passport';
import { userModel } from '../../../models/user.js';
import { validatePassword, createHash } from '../../../utils/bcrypt.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({ passReqToCallBack: true, usernameField: 'email'}, async (req, email, password, done) => {

        try {
            const {nombre, apellido, password, edad, email} = req.body;
            const findUser = await userModel.findOne({email: email});
            if(findUser){
               return done(null, false)
            } else {
               const user = await userModel.create({nombre, apellido, edad, email, password: createHash(password)});
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }

    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      const user = await userModel.findById(id);
        done(null, user);
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email'}, async ( email, password, done) => {


        try {
            const user = await userModel.findOne({email: email});

            if (user && validatePassword(password, user.password)) {
                req.session.email = email;
                if(user.role === 'admin'){
                    req.sesion.admin = true
                    return done(null, user)
                } else {
                    return done(null, user)
                }

            } else {
                return done(null, false)
            }
        } catch (e) {
            return done(e);
        }

    }))
}

export default initializePassport;
