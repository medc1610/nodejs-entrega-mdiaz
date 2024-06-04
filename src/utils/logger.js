import winston from "winston"


const customLevelOtp = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },

    color: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'cyan',
        http: 'white',
        debug: 'black'
    }
}

const logger = winston.createLogger({
    levels: customLevelOtp.levels,
    transports: [

        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOtp.color}),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            level: 'http',
            filename: './http.log',
            format: winston.format.simple()
        }),

        new winston.transports.File({
            level: 'debug',
            filename: './debug.log',
            format: winston.format.simple()
        }),

        new winston.transports.File({
            level: 'warning',
            filename: './warnings.log',
            format: winston.format.simple()
        }),

        new winston.transports.File({
            level: 'error',
            filename: './errors.log',
            format: winston.format.simple()
        }),

        new winston.transports.File({
            level: 'fatal',
            filename: './fatal.log',
            format: winston.format.simple()
        })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} es ${req.path} - ${new Date().toLocaleDateString()}` )
    next()
}
