import multer from 'multer';
import customError from "../service/errors/CutomError.js";
import enumErrors from "../service/errors/enumError.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const nombre = file.fieldname.toLocaleLowerCase();
    if(nombre == 'identification')
      cb(null, './src/files/documents/identification')
    else if(nombre == 'proof_of_address')
      cb(null, './src/files/documents/proof_of_address')
    else if(nombre == 'proof_of_status'){
      cb(null, './src/files/documents/proof_of_status')
    }
    else{
      customError.createError({
        name: "Error archivo",
        cause: "Error al subir el archivo",
        message: "Error con el filedname del archivo",
        code:   enumErrors.ERROR_FILE
      });
    }
  },
  filename: (req, file, cb) =>{
    const nombre = req.params.uid+'_'+file.fieldname+'.'+file.originalname.split('.')[1];
    cb(null, nombre)
  },
});

export const uploader = multer({ storage });