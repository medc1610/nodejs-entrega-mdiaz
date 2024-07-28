import { json, query, response } from "express";
import { productoModel } from "../models/producto.model.js";
import  UserRepository from "../../repositories/userRepository.js"
import customError from "../../service/errors/CutomError.js";
import enumErrors from "../../service/errors/enumError.js"
import bcrypt from 'bcrypt';
import {logger} from '../../utils/logger.js';
import UserDTO from '../../dto/userDTO.js';

const userRepository = new UserRepository();

export default class UserManager{
   
    async getProducts(){

        try{      

            const productos = await productRepository.getProducts();
            return productos;
           
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al obtener productos desde la base de datos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

   
    async updateUserPremiumRoleById(id) {
        try{

            const user = await userRepository.getUserById(id);
            if(!user){
                customError.createError({
                    name: "Error Usuario",
                    cause: "Error no se encontro el usuario",
                    message: `Error al encontrar el usuario de id:(${id}) en la base de datos`,
                    code:   enumErrors.ERROR_DATA_NO_EXIST
                });
            }
            let newRole = user[0].role;
            let documents = user[0].documents.length;
            if(documents < 3){
                customError.createError({
                    name: "Error Upgrade usuario",
                    cause: "Error no se a terminado de subir la documentacion",
                    message: `Error no se a terminado de procesar todos los documentos, por favor de subirlos`,
                    code:   enumErrors.ERROR_FILE
                });
            }

            if(newRole == 'user' && documents == 3){
                newRole = 'premium';
            }else{
                if(newRole == 'premium'){
                    newRole = 'user';
                }
            }   
            await userRepository.updateUserRoleById(id,newRole);
            
            return {status: `Rol acutalizado a ${newRole}`};
           
        }catch(e){
            if(e.code){
                throw e;
            }
            console.log(e);
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al actualizar el rol en la base de datos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }


    async updatePassByEmail(email,newPass) {
        try{
            const user = await userRepository.getUserByEmail(email);
            if(!user.length){
                customError.createError({
                    name: "Error Email",
                    cause: "Error no se encontro usuario",
                    message: "Error al cambiar contraseña",
                    code:   enumErrors.ERROR_DATA_NO_EXIST
                }); 
            }
            logger.info(user.length);
            if(bcrypt.compareSync(newPass, user[0].password)){
                return -1;
            }
            const passCryp = bcrypt.hashSync(newPass, bcrypt.genSaltSync(10));
            const newUser = await userRepository.updatePassByEmail(email,passCryp);
            return newUser;
        }catch(e){
            if(e.code){
                throw e;
            }
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al actualizar un producto en la base de datos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async updateLastConnection(email) {
        try{
            await userRepository.updateLastConnection(email);
            
            return true;
        }catch(e){
            if(e.code){
                throw e;
            }
            customError.createError({
                name: "Error Email",
                cause: "Error no se encontro usuario",
                message: "Error al registrar ultima conexion",
                code:   enumErrors.ERROR_DATA_NO_EXIST
            });
        }
    }

    async getDocuments(id){

        try{      

            const documents = await userRepository.getDocuments(id);
            return documents;
           
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al obtener productos desde la base de datos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async updateDocuments(id,newDocuments) {
        try{
            await userRepository.updateDocuments(id,newDocuments);
            
            return true;
        }catch(e){
            if(e.code){
                throw e;
            }
            customError.createError({
                name: "Error Email",
                cause: "Error no se encontro usuario",
                message: "Error al actualizar los documetos",
                code:   enumErrors.ERROR_DATA_NO_EXIST
            });
        }
    }


    async getAllUsers() {
        try{
            const users = await userRepository.getAllUsers();
            const listUsers  = [];            
            users.forEach(user => {
                listUsers.push({
                    id : user._id,
                    first_name : user.first_name,
                    last_name : user.last_name,
                    email : user.email,
                    role : user.role
                });
            });
            
            return listUsers;
        }catch(e){
            if(e.code){
                throw e;
            }
            customError.createError({
                name: "Error Email",
                cause: "Error no se encontro usuario",
                message: "Error al actualizar los documetos",
                code:   enumErrors.ERROR_DATA_NO_EXIST
            });
        }
    }


    async deleteAllUsers() {
        try{
            const users = await userRepository.deleteAllUsers();
           
            if (!users){
                customError.createError({
                    name: "Error Usuarios",
                    cause: "Error no se pudieron borrar los usuarios",
                    message: "Error al borrar usuarios",
                    code:   enumErrors.ERROR_BASE_DATOS
                });
            }

            return users;
        }catch(e){
            if(e.code){
                throw e;
            }
            customError.createError({
                name: "Error Email",
                cause: "Error no se encontro usuario",
                message: "Error al actualizar los documetos",
                code:   enumErrors.ERROR_DATA_NO_EXIST
            });
        }
    }

    async deleteUserByEmail(email) {
        try{
            const users = await userRepository.deleteUserByEmail(email);
           
            if (!users){
                customError.createError({
                    name: "Error Usuarios",
                    cause: "Error no se pudieron borrar los usuarios",
                    message: "Error al borrar usuarios",
                    code:   enumErrors.ERROR_BASE_DATOS
                });
            }

            return users;
        }catch(e){
            if(e.code){
                throw e;
            }
            customError.createError({
                name: "Error Email",
                cause: "Error no se encontro usuario",
                message: "Error al actualizar los documetos",
                code:   enumErrors.ERROR_DATA_NO_EXIST
            });
        }
    }
}


