import dotenv from 'dotenv';

dotenv.config();


const varenv = {
    MONGO_BD_URL: process.env.MONGO_BD_URL,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SALT: process.env.SALT,
    JWT_SECRET: process.env.JWT_SECRET
}

export default varenv;
