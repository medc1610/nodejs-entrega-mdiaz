import enumErrors from '../../service/errors/enumError.js';
import {logger} from '../../utils/logger.js';

export default (err,req,res,next) =>{
    logger.debug(`causa del error: ${err.cause}`);
    logger.debug('-------------------------------------------------');
    switch (err.code) {
        case enumErrors.ERROR_BASE_DATOS:
            res.status(500).send({status:'error',error:err.message});
            break;
        case enumErrors.ERROR_TYPE:
            res.status(400).send({status:'error',error:err.message});
            break;
        case enumErrors.ERROR_DATA_NO_EXIST:
            res.status(400).send({status:'error',error:err.message});
            break;
        case enumErrors.ERROR_FILE:
            res.status(400).send({status:'error',error:err.message});
            break;
        default:
            res.status(523).send({status:'error',error:'Error no manejado',code:err.code});
            break;
    }
}