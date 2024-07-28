import { cartsModel } from "../dao/models/cart.model.js";

export default class CartRepository{
    
    async addCart(){
        const cart = await cartsModel.create({});      
        return cart;
    }

    async updateProductsByCart(idCart,data){

        const respCart = await cartsModel.updateOne({_id : idCart},{products:data}).lean();
        return respCart; 
    }

    async getCartPopulateById(id){
        const cart = await cartsModel.find({_id : id}).populate('products.product').lean();
        return cart;
    }
}