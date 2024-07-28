import { cartsModel } from "../models/cart.model.js";
import { productoModel } from "../models/producto.model.js";
import  ProductRepository from "../../repositories/ProductRepository.js"
import  CartRepository from "../../repositories/CartRepository.js"
import EmailService from "../../service/mail.service.js";
import TicketManager from "./TicketManager.js";
import customError from "../../service/errors/CutomError.js";
import enumErrors from "../../service/errors/enumError.js";
import {logger} from '../../utils/logger.js';

const ticketManager = new TicketManager();
const emailService =  new EmailService();
const productRepository = new ProductRepository();
const cartRepository = new CartRepository();    


export default class CartManager{

    async addCart() {      
       try{
            const carrito = await cartsModel.create({});
            return carrito; 
       }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al generar un carrito en la base de datos",
                code:   enumErrors.ERROR_BASE_DATOS
            });
       }      
    }
   
    async getCartProductsById(id){
        
        try{
            const carrito = await cartsModel.find({_id : id}).lean();
            return carrito;
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al buscar carrito por id",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        } 
    }
    async getCartPopulateById(id){
        
        try{
            const cart = await cartRepository.getCartPopulateById(id);
            return cart;
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al realizar populate en el carrito",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async addProductIntoCart(idc,idp){
        try{
            const carrito = await this.getCartProductsById(idc); 
            
            if(carrito.length === 0){
                customError.createError({
                    name: "Error data",
                    cause: "No existe carrito",
                    message: `el carro id: ${idc}, no existe`,
                    code:   enumErrors.ERROR_DATA_NO_EXIST
                });
            }
            const producto = await productoModel.find({_id : idp}).lean();
            if(producto.length === 0){
                customError.createError({
                    name: "Error data",
                    cause: "No existe producto",
                    message: `el producto id: ${idp}, no existe`,
                    code:   enumErrors.ERROR_DATA_NO_EXIST
                });
            }
            
            const {products} = carrito[0];


            let detalleProducto = products.filter((producto)=> {

                if(producto.product.toString() === idp){
                    producto.quantity++;
                    return producto;
                }
            });
            if(!detalleProducto.length){
                detalleProducto = {product: idp, quantity: 1 }
                products.push(detalleProducto);
            }

            await cartsModel.updateOne(
                { _id: idc },
                {products}
            ); 
            
            const result = await this.getCartProductsById(idc); 
           
            return result;
        }catch(e){

            if(e.code){
                throw e;
            }
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al insertat un producto en el carrito",
                code:   enumErrors.ERROR_BASE_DATOS
            });
           
        }
    }

    async deleteProductByCart(idCart,idProduct){

        try{
            const cart = await this.getCartProductsById(idCart);
            const newProducts = cart[0].products.filter((prod) => prod.product.toString() != idProduct);
            
            const respCart = await cartsModel.updateOne({_id : idCart},{products:newProducts}).lean();
            return respCart; 
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al eliminar un producto de un carrito",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async deleteAllProductByCart(idCart){
       
        try{
            const respCart = await cartsModel.updateOne({_id : idCart},{products:[]}).lean();
            return respCart; 
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al eliminar todos los productos de un carrito",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async updateProductsByCart(idCart,data){

       
        try{
            const respCart = await cartsModel.updateOne({_id : idCart},{products:data}).lean();
            return respCart; 
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al actualizar un producto de un carrito",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }

    async updateQuantityProductsByCart(idCart,idProduct,data){

        try{
            const cart = await this.getCartProductsById(idCart);
            const newProducts = cart[0].products.filter((product) => {
                if(product.product.toString() === idProduct){
                    product.quantity = data;
                }
                return product;
            });
            const respCart = await cartsModel.updateOne({_id : idCart},{products:newProducts}).lean();
            return respCart; 
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al actualizar la cantidad de un producto en el carrito",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }



    async purchaseCart(idCart,emailSend){        
        try{
            //const cart = await this.getCartProductsById(idCart);
            const cart = await cartRepository.getCartPopulateById(idCart);
            const cartFilter = cart[0].products.filter(producto => producto.product.stock - producto.quantity < 0);
            const cartBuy = cart[0].products.filter(products => products.product.stock - products.quantity >= 0);

            cartBuy.forEach(async cart =>{
                let newStock = cart.product.stock - cart.quantity;
                await productRepository.updateStockProductById(cart.product._id,newStock);            
            });
            const newProducts = [];
            cartFilter.forEach(async cart => {
                
                let newProduct = {
                    product : cart.product._id,
                    quantity : cart.quantity
                }
                newProducts.push(newProduct);
            });

            if(cartBuy.length > 0){
                
                await cartRepository.updateProductsByCart(idCart,newProducts);
                const text = 'Compra completada desde la web';
                const html = '<h1>compra realizada<h1>';
                const title = 'Compra CodeMarket';
                await emailService.sendEmail(emailSend,title,text,html);
                await ticketManager.addTicket(cartBuy,emailSend);
                
            } 
               
            logger.info(`carro de id ${idCart} comparado`);    
            return cartFilter; 
        }catch(e){
            customError.createError({
                name: "Error DB",
                cause: "Error de conexion",
                message: "Error al generar la compra del carrito",
                code:   enumErrors.ERROR_BASE_DATOS
            });
        }
    }
}


