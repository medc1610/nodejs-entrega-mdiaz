import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { userModel } from '../../../models/user.js';
import varenv from '../../../dotenv.js';


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: varenv.JWT_SECRET
}


export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) => {
    try{
        const user = await userModel.findById(payload.user._id);
        if(!user){
           return done(null, false)
        }
        return done(null, user)
    }catch (error){
        return done(error, null)
    }
});
