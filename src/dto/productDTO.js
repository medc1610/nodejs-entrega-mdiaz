import { faker } from "@faker-js/faker";
export default class ProductDTO{
    #product;
    constructor(){}

    addproduct(pProduct){
        this.#product = {           
            title: pProduct.title,
            description: pProduct.description,
            code: pProduct.code,           
            price: pProduct.price,
            status: pProduct.status,
            stock: pProduct.stock,
            category: pProduct.category,
            thumbnails: pProduct.thumbnails,
        }
        
    }
    getProduct(){
        return this.#product;
    }

    getMockProducts(){
        const listProducts = [];

        for (let index = 0; index < 100; index++) {
            const product = {
                title: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                code:faker.string.alpha(6),                 
                price: faker.commerce.price(),
                status: true,
                stock: faker.number.int(1000) ,
                category: faker.commerce.productAdjective(),
                thumbnails: faker.image.url() ,
            }
            listProducts.push(product);
            
        }


        return listProducts;
    }

}