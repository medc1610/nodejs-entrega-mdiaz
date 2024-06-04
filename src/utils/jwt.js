import jwt from 'jsonwebtoken';
import varenv from '../dotenv.js';

export const generateToken = (user) => {
    const token = jwt.sign({ user}, varenv.JWT_SECRET , {expiresIn: '12h'});
    console.log(token)
    return token
}

