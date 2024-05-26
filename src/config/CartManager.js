import fs from 'fs';


export class CartManager {
    path = './src/data/cart.json';
    path2 = './src/data/products.json';


    addCart(cart) {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '[]');
        } else {
            let contenido = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            cart.id = contenido.length + 1;
            contenido.push(cart);
            fs.writeFileSync(this.path, JSON.stringify(contenido));
            return "Carrito agregado"
        }
    }

    addProduct(cid, pid) {
        if (!fs.existsSync(this.path)) {
           return "No hay carritos"
        } else {
            let contenido = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            let products = JSON.parse(fs.readFileSync(this.path2, 'utf8'));

            if (products.some(prod => Number(prod.id) === Number(pid)) && contenido.some(cart => Number(cart.id) === Number(cid))){
                if (contenido.some(cart => Number(cart.id) === Number(cid)) && contenido[cid - 1]['products'].some(prod => Number(prod.idProduct) === Number(pid))) {
                    contenido[cid - 1]['products'][pid - 1].quantity += 1;
                    fs.writeFileSync(this.path, JSON.stringify(contenido));
                    return "Producto actualizado"
                } else {
                    let product = {
                        idProduct: products[pid - 1].id,
                        quantity: 1,
                    }
                    contenido[cid - 1]['products'].push(product);
                    fs.writeFileSync(this.path, JSON.stringify(contenido));
                    return "Producto agregado"
                }

            } else {
                return "El producto o el carrito no existe"
            }
        }
    }

    getCarts() {
        let contenido = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(contenido)
    }

    getCartById(id) {
        const cId = Number(id);
        let contenido = fs.readFileSync(this.path, 'utf8');
        let JsonContenido = JSON.parse(contenido);
        if (JsonContenido.find(cart => cart.id === cId) === undefined) {
            return "El carrito no existe"
        } else {
            return JsonContenido[cId - 1]
        }
    }
}

