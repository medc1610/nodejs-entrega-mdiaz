import fs from 'fs';

export default class CartManager{
    static id = 1;
    #path = './src/json/carritos.json';
    #pathProduct = './src/json/productos.json';
    #listaCarritos = [];

    constructor(){ }

    addCart() {      
       
        const carrito = {
            id: CartManager.id ++,
            products:[],
        };
        this.#listaCarritos.push(carrito);
        this.escribirEnArchivo(this.#listaCarritos);
        return true;       
    }


    async addProductIntoCart(cid,pid) {      
       
        const carrito = await this.getCartById(cid);
        if(!carrito.length){
            return -1;
        }        
        const existeProdcutp = await this.getProductById(pid);
        if(!existeProdcutp.length){
            return -2;
        } 
        const listaProductos = carrito[0]['products'];
        let detalleProducto = listaProductos.filter((producto)=> {
                if(producto.id === pid){
                    producto.quantity++;
                    return producto;
                }
            });
        if(!detalleProducto.length){
            detalleProducto =
                {id: pid, quantity: 1 }
            listaProductos.push(detalleProducto);
        }
        
        const carritos = await this.leerArchivo(this.#path);
        const carritoActualizado = carritos.filter((carrito) => {
           if(carrito.id === cid){
                carrito.products = listaProductos;               
           }
           return carrito;
        });
        this.escribirEnArchivo(carritoActualizado);
        return 1;       
    }    

    async escribirEnArchivo(data) {
        await fs.promises.writeFile(
            this.#path,
            JSON.stringify(data, null, '\t')
        );
    }

    async leerArchivo(path) {
        const data = await fs.promises.readFile(path, 'utf-8');        
        return JSON.parse(data);
    }
    

    async getCartById(id) {
        const carritos = await this.leerArchivo(this.#path);
        const carrito = carritos.filter((carrito) => carrito.id === id);
        return carrito;
    }

    async getProductById(id) {
        const productos = await this.leerArchivo(this.#pathProduct);
        const producto = productos.filter((producto) => producto.id === id);
        return producto;
    }

    async getCartProductsById(pid) {
        const carritos = await this.leerArchivo(this.#path);
        const carrito =carritos.filter(({id}) => id === pid);
        const cartProductos = [];
        let product = []
        
        const listaProductos = carrito[0].products;

        for (let i = 0; i < listaProductos.length; i++) {
            product  = await this.getProductById(listaProductos[i]['id']);
            if(!product.length){
                product = [{ Error: 'producto no existe'}]
            }
            cartProductos.push(product[0]);
        }     
        
        return cartProductos;
    }
    
  
}


