import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import config from '../../config/config.js';

export default class Conection{
    constructor(){
        mongoose.connect(config.mongo_url);
    }

    sessionMongo(){
        return session({
            store: MongoStore.create({
              mongoUrl:
                config.mongo_url,
              ttl: 120,
            }),
            secret:  config.mongo_secret,
            resave: false,
            saveUninitialized: false,
          });
    }
}

