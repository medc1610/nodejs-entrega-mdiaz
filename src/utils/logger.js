import winston from 'winston';
import config from '../config/config.js';

let logger;
if (config.environment === 'PRODUCTION') {
  logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
      }),
      new winston.transports.File({
        filename:'./src/logs/erros.log', 
        level: 'info',
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
      }),
      new winston.transports.File({
        filename:'./src/logs/erros.log', 
        level: 'debug',
      }),
    ],
  });
}

export { logger };