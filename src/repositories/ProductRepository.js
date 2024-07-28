import { productoModel } from "../dao/models/producto.model.js";

import config from '../config/config.js';

export default class ProductRepository{
    
    async addProduct(data){
        const {title,description,code,price,status,stock,category,thumbnails} = data;
        const addProductDTO = await productoModel.create({
            title,description,code,price,status,stock,category,thumbnails
        });       
        return addProductDTO;
    }

    async getProducts(){      

        const products = await productoModel.paginate().lean();        
        return products;
    }

    async getProducts(query,param,pLimit,pSort,pQuery){      

        const products = await productoModel.paginate(query,param);
       
        const listProductsDTO = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage?  `${config.host}/products?limit=${pLimit}&page=${ products.prevPage}&sort=${pSort}&query=${pQuery}` : null,
            nextLink: products.hasNextPage?  `${config.host}/products?limit=${pLimit}&page=${ products.nextPage}&sort=${pSort}&query=${pQuery}` : null,

        }

        return listProductsDTO;
    }
    
    async getProductsLimit(plimit){      

        const products = await productoModel.paginate({},{limit:plimit,lean:true});     
        return products;
    }

    async getProductById(pid){      

        const products = await productoModel.find( { _id: pid }).lean();
        return products;
    }

    async updateProductById(uid,data) {
        const relust = await productoModel.updateOne(
            { _id: uid },
            data
        ); 
        return relust;
    }

    async updateStockProductById(uid,pstock) {
        const relust = await productoModel.updateOne(
            { _id: uid },
            {stock : pstock}
        ); 
        return relust;
    }

    async deleteProduct(did) {
        const relust = await productoModel.deleteOne({ _id: did });
        return relust;
    }
   
}