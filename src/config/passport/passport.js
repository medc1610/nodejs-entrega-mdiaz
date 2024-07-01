import local from 'passport-local';
import passport from 'passport';
import crypto from 'crypto';
import { userModel } from '../../models/user.js';
import GithubStrategy from 'passport-github2';
import { createHash, validatePassword } from '../../utils/bcrypt.js';
import { strategyJWT } from './strategies/jwtStrategy.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            const { firstName, lastName, email, password, edad, role } = req.body
            const findUser = await userModel.findOne({ email: email })
            if (findUser) {
                return done(null, false)
            } else {
                const user = await userModel.create({ firstName: firstName, lastName: lastName, email: email, edad: edad, role:role? role: 'user', password: createHash(password) })
                return done(null, user)
            }
        } catch (e) {
            return done(e)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username }).lean()
            if (user && validatePassword(password, user.password)) {
                await userModel.findByIdAndUpdate(user._id, { last_connection: new Date() })
                await user.save()
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch (e) {
            return done(e)
        }
    }))

    // passport.use('github', new GithubStrategy({
    //         clientID: process.env.GITHUB_CLIENT_ID,
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //         callbackURL: process.env.GITHUB_CALLBACK_URL
    //     }, async (accessToken, refreshToken, profile, done) => {
    //         try {
    //             const user = await userModel.findOne({email: profile._json.email}).lean();
    //             if (user) {
    //                 return done(null, user);
    //             } else {
    //                 const randomNumber = crypto.randomUUID();
    //                 const userCreated = await userModel.create({
    //                     first_name: profile._json.name,
    //                     last_name: '',
    //                     age: 18,
    //                     email: profile._json.email,
    //                     password: createHash(`${profile._json.name}${randomNumber}`)
    //                 });
    //                 return done(null, userCreated);
    //             }
    //         } catch
    //             (error) {
    //             return done(error);
    //         }
    //     }
    // ))

    passport.use('jwt', strategyJWT)
}

export default initializePassport;
