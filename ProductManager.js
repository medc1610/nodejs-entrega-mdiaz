import fs from 'fs';


class ProductManager {
    path = './ejemplo.json';

    constructor() {
        this.products = [];

    }


    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock || !product.code) {
            console.error("Faltan datos");
        } else if (this.products.some(prod => prod.code === product.code)) {
            console.error("El producto ya existe");
        } else {
            console.log("Producto agregados");
            product.id = this.products.length + 1;
            this.products.push(product);
            fs.writeFileSync(this.path, JSON.stringify(this.products));
        }
    }


    getProducts() {
        let contenido = fs.readFileSync(this.path, 'utf8');
        console.log("getProducts:",JSON.parse(contenido));

    }

    getProductById(id) {
        let contenido = fs.readFileSync(this.path, 'utf8');
        let JsonContenido = JSON.parse(contenido);
        if (JsonContenido.find(prod => prod.id === id) === undefined) {
            console.error("El producto no existe");
        } else {
            console.log(JsonContenido.find(prod => prod.id === id));
        }

    }

    putProductById(id, product) {
        let contenido = fs.readFileSync(this.path, 'utf8');
        let JsonContenido = JSON.parse(contenido);
        let index = JsonContenido.findIndex(prod => prod.id === id);
        if (JsonContenido[index] === undefined) {
            console.error("El producto no existe");
        } else {
            let params = Object.keys(product);
            params.forEach(param => {
                JsonContenido[index][param] = product[param];
            });
            JsonContenido[index].id = id;
            fs.writeFileSync(this.path, JSON.stringify(JsonContenido));
            console.log("Producto actualizado", JsonContenido[index])
        }
    }

    deleteProductById(id) {
        let contenido = fs.readFileSync(this.path, 'utf8');
        let JsonContenido = JSON.parse(contenido);
        let index = JsonContenido.findIndex(prod => prod.id === id);
        if (JsonContenido[index] === undefined) {
            console.error("El producto no existe");
        } else {
            JsonContenido.splice(index, 1);
            fs.writeFileSync(this.path, JSON.stringify(JsonContenido));
            console.log("Producto eliminado");
        }
    }


}


const products = new ProductManager();

products.getProducts();
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
    title: "producto 3",
    description: "producto 3",
    price: 300,
    thumbnail: "https",
    stock: 300,
    code: "abc12345",
});
products.addProduct({
    title: "producto 1",
    description: "producto 1",
    price: 100,
    thumbnail: "https",
    stock: 10,
    ode: "abc123",
});
products.addProduct({name: "Producto 2", price: 200});
products.getProducts();
products.getProductById(2)
products.getProductById(4)
products.putProductById(2, {code: "abc1234", title: "producto 2"});
products.putProductById(6, {code: "abc1234", title: "producto 2"});
products.deleteProductById(5);
products.deleteProductById(1);
