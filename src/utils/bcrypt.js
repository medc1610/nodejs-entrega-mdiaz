import bcrypt from 'bcrypt';
import varenv from '../dotenv.js';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const validatePassword = (passwordSend, passwordBdd) => bcrypt.compareSync(passwordSend, passwordBdd);
