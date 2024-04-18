import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { userModel } from '../../../models/user.js';


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "coderhouse"
}


export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) => {
    try{
        const user = await userModel.findById(payload.user._id);
        if(!user){
            done(null, false)
        }
        done(null, user)
    }catch (error){
        done(error, null)
    }
});
