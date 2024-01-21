
class ProductManager {
  
    constructor() {
        this.products = [];
    }

    addProduct(product)  {
        if(!product.title || !product.description || !product.price || !product.thumbnail || !product.stock || !product.code) {
            console.error("Faltan datos");
        } else if (this.products.some(prod => prod.code === product.code)) {
            console.error("El producto ya existe");
        } else {
            console.log("Producto agregado");
            product.id = this.products.length + 1;
            this.products.push(product);
        }
    
        
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(prod => prod.id === id);
        if (product) {
            return product;
        } else {
           return "El producto no existe";
        }
    }
}


const products = new ProductManager();
products.addProduct({
    title: "producto 1",
    description: "producto 1",
    price: 100,
    thumbnail: "https",
    stock: 10,
    code: "abc123",
});
products.addProduct({
    title: "producto 2",
    description: "producto 2",
    price: 200,
    thumbnail: "https",
    stock: 200,
    code: "abc1234",
});
products.addProduct({
    title: "producto 1",
    description: "producto 1",
    price: 100,
    thumbnail: "https",
    stock: 10,
    code: "abc123",
});
products.addProduct({name: "Producto 2", price: 200});
console.log(products.getProducts());
console.log(products.getProductById(2));
console.log(products.getProductById(5));
