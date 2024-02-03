import fs  from 'fs';


export class ProductManager {
    path = './src/ejemplo.json';

    constructor() {
        this.products = [];

    }


    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock || !product.code) {
            console.error("Faltan datos");
        } else if (this.products.some(prod => prod.code === product.code)) {
            console.error("El producto ya existe");
        } else {
            product.id = this.products.length + 1;
            this.products.push(product);
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            return "Producto agregados"
        }
    }


    getProducts() {
        let contenido = fs.readFileSync(this.path, 'utf8');
       return  JSON.parse(contenido)

    }

    getProductById(id) {
        const pId = Number(id);
        let contenido = fs.readFileSync(this.path, 'utf8');
        let JsonContenido = JSON.parse(contenido);
        if (JsonContenido.find(prod => prod.id === pId) === undefined) {
            return "El producto no existe"
        } else {
           return JsonContenido.find(prod => prod.id === pId)
        }

    }

    putProductById(id, product) {
        let contenido = fs.readFileSync(this.path, 'utf8');
        let JsonContenido = JSON.parse(contenido);
        let index = JsonContenido.findIndex(prod => prod.id === id);
        if (JsonContenido[index] === undefined) {
            return "El producto no existe"
        } else {
            let params = Object.keys(product);
            params.forEach(param => {
                JsonContenido[index][param] = product[param];
            });
            JsonContenido[index].id = id;
            fs.writeFileSync(this.path, JSON.stringify(JsonContenido));
            return JsonContenido[index]
        }
    }

    deleteProductById(id) {
        let contenido = fs.readFileSync(this.path, 'utf8');
        let JsonContenido = JSON.parse(contenido);
        let index = JsonContenido.findIndex(prod => prod.id === id);
        if (JsonContenido[index] === undefined) {
            return "El producto no existe"
        } else {
            JsonContenido.splice(index, 1);
            fs.writeFileSync(this.path, JSON.stringify(JsonContenido));
            return "Producto eliminado"
        }
    }


}

