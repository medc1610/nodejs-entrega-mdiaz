import { json, query } from "express";
import { productoModel } from "../models/producto.model.js";
import  ProductRepository from "../../repositories/ProductRepository.js"
import customError from "../../service/errors/CutomError.js";
import enumErrors from "../../service/errors/enumError.js"
import EmailService from "../../service/mail.service.js";
const emailService =  new EmailService();

const productRepository = new ProductRepository();

export default class ProductManager{
   
    async addPoduct(data){       
        try{
            const producto = await productRepository.addProduct(data);
            return producto;
        }catch(e){
                customError.createError({
                    name: "Error DB",
                    cause: "Error de conexion",
                    message: "Error al generar un producto en la base de datos",
                    code:   enumErrors.ERROR_BASE_DATOS
                });
        }
    }

    async getProductsLimit(plimit){

        try{       

            const productos = await productRepository.productRepository(plimit);
            return productos;
           
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al obtener productos desde la base de datos con limite",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }
    
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

    async getProducts(pLimit,pPage,pSort,pQuery){          
       
        try{
             //se crean variables para mandarlas a los link de paginas anteriores o siguientes con servarndo el sort o el query inicial, 
            //para que no se pierdan en el camino       

            if(!pLimit){
                pLimit = 10;
            }
            if(!pPage){
                pPage = 1;
            }

            const param = {
                limit:pLimit,
                page:pPage,
                lean:true,
            };
            if(pSort != undefined && pSort!= "undefined"){
                param.sort= {price:pSort};
            }
            let query = {}
            if(pQuery!= undefined && pQuery!= "undefined"){
                query =  JSON.parse('{'+pQuery+'}');
            }
        
            const result =await productRepository.getProducts(query,param,pLimit,pSort,pQuery);
            
            return result;
           
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al obener de la base el listado de productos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async getProductById(pid){ 
        try{     

            const products = await productRepository.getProductById(pid);
            return products;
           
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al obtener un producto en la base de datos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    validarDatos(data){
       
            const {title,description,code,price,status,stock,category} = data;
            if (!title || !description || !code || !price || status == undefined || !stock || !category ) {           
                customError.createError({
                    name: "Error en los datos de producto",
                    cause: "Error en los datos recividos para agragar producto",
                    message: "Todos los valores del producto tienen que ser enviados. a excepcion de thumbnails",
                    code:   enumErrors.ERROR_TYPE
                });
            }
       
    }

    async updateProductById(uid,data) {
        try{
            await productRepository.updateProductById(uid,data);         
            const product = await this.getProductById(uid);
            return product;
           
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

    async updateProductWithOwnerById(uid,data,pOwner) {
        try{
            
            const productOwner = await this.getProductById(uid);

            if(productOwner[0].owner == pOwner){
                await productRepository.updateProductById(uid,data);
                const product = await this.getProductById(uid);
                return product;
            }

            customError.createError({
                name: "Error Update producto",
                cause: "Error owner distinto",
                message: "Error el producto no pertenece al owner",
                code:   enumErrors.ERROR_DATA_NO_EXIST
            });
           
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
    
    async deleteProduct(did,email) {
        try{
            const productOwner = await this.getProductById(did);
            const relust = await productRepository.deleteProduct(did);
            if(!productOwner[0].owner == 'admin'){
                await enviarEmailOwner(productOwner[0].owner);
            }
            return relust;
           
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al eliminar un producto en la base de datos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async deleteProductWithOwner(did) {
        try{
            const productOwner = await this.getProductById(did);
            const relust  = await productRepository.deleteProduct(did); 
            if(!productOwner[0].owner == 'admin'){
                await enviarEmailOwner(productOwner[0].owner);
                             
            }
            return relust;  
            customError.createError({
                name: "Error Delete producto",
                cause: "Error owner distinto",
                message: "Error el producto no pertenece al owner",
                code:   enumErrors.ERROR_DATA_NO_EXIST
            });
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al eliminar un producto en la base de datos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async enviarEmailOwner(emailSend){
        if (!emailSend == 'admin'){
            const text = 'Se elimino un proucto asignado a esta cuenta';
            const html = '<h1>Producto eliminado<h1>';
            const title = 'Se elimino el uno de sus productos';
            await emailService.sendEmail(emailSend,title,text,html);
        }
    }
}



