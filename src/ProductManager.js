import fs from 'fs';


export class ProductManager {
    path = './src/data/products.json';


    addProduct(product) {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '[]');
        } else {
            let contenido = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock || !product.code) {
                console.error("Faltan datos");
            } else if (contenido.some(prod => prod.code === product.code)) {
                return "El producto ya existe";
            } else {
                product.id = contenido.length + 1;
                product.status = true;
                contenido.push(product);
                console.log(contenido);
                fs.writeFileSync(this.path, JSON.stringify(contenido));
                return "Producto agregado"
            }
        }

    }


    getProducts() {
        let contenido = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(contenido)
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
        if (JsonContenido[id - 1] === undefined) {
            return "El producto no existe"
        } else {
            let params = Object.keys(product);
            params.forEach(param => {
                JsonContenido[id - 1][param] = product[param];
            });
            JsonContenido[id - 1].id = id;
            fs.writeFileSync(this.path, JSON.stringify(JsonContenido));
            return JsonContenido[id - 1]
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

