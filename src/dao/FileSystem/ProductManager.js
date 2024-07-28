import fs from 'fs';

export default class ProductManager{
    static id = 1;
    #path = './src/json/productos.json';
    #listaProductos = [];

    constructor(){
        try{
           // this.productosDefault();
           //this.#listaProductos = this.leerArchivo();
           // this.escribirEnArchivo(this.#listaProductos);
          
        }
        catch (error){
            //console.log("La ruta debe contener algun dato");
            return false;
        }
    }

    async productosDefault(){
       this.addPoductArray('Jugo','Agua con azucar y colorante','BD35',200,true,10,'Comestible',['../Img/Jugo.png','../Img/default.png']);
       this.addPoductArray('Libro','Contiene informacion de ...','WJSTR',35000,true,20,'Entretencion',['../Img/Libro.png','../Img/default.png']);
       this.addPoductArray('Helado','Helado de manzana con sabor a limon','2ETLRO',4000,true,35,'Comestible',['../Img/Helado.png','../Img/default.png']); 
       this.addPoductArray('Cafe','100% grano molido','EF1MG',4500,true,40,'Comestible',['../Img/Cafe.png','../Img/default.png']);
       this.addPoductArray('Especias','mescla de especias para cocinar','SEPM26',1000,true,30,'Comestible',['../Img/Especias.png','../Img/default.png']);
       this.addPoductArray('Arroz','Arroz Grado 2 Bolsa, 1 kg','ZA2G1',1600,true,60,'Comestible',['../Img/Arroz.png','../Img/default.png']);
       this.addPoductArray('Empanadas','Empanadas congeladas','PM18C',2500,true,25,'Comestible',['../Img/Empanadas.png','../Img/default.png']);
       this.addPoductArray('Doritos','Doritos Queso','SD81Q',800,true,100,'Comestible',['../Img/Doritos.png','../Img/default.png']);
       this.addPoductArray('Galletas','Galleta Nik Bocado','G10N3',500,true,60,'Comestible',['../Img/Galletas.png','../Img/default.png']);
       this.addPoductArray('Manzana','Manzana Royal Bolsa, 1 kg','ZNM1R',1700,true,30,'Comestible',['../Img/Manzana.png','../Img/default.png']);

       //this.escribirEnArchivo(this.#listaProductos);
    }


    async addPoductArray(title,description,code,price,status,stock,category,thumbnails) {
        await this.obtenerUltimoID();      
        this.#listaProductos = await this.leerArchivo();

        const pruducto = {
            id: ProductManager.id ++,
            title,description,code,price,
            status : (status != false)? true: false ,
            stock,category,
            thumbnails : (!thumbnails)? []: thumbnails,
        };
        this.#listaProductos.push(pruducto);
        this.escribirEnArchivo(this.#listaProductos);
        return true;
       
    }

    
    async addPoduct(title,description,code,price,status,stock,category,thumbnails) {      
        this.#listaProductos = this.leerArchivo();
        const pruducto = {
            id: ProductManager.id ++,
            title,description,code,price, status ,stock,category,thumbnails 
        };
        this.#listaProductos.push(pruducto);
        this.escribirEnArchivo(this.#listaProductos);
        return true;
       
    }

    async escribirEnArchivo(data) {

        await fs.promises.writeFile(
            this.#path,
            JSON.stringify(data, null, '\t')
        );
    }

    async getProductsLimit(limit) {       
        const productos = await this.leerArchivo();
        return productos.slice(0,limit);
    }

    async getProducts() {       
        const productos = await this.leerArchivo();
        return productos;
    }

    async leerArchivo() {
        try{
            const data = await fs.promises.readFile(this.#path, 'utf-8');        
            return JSON.parse(data);
        }catch{
            return [];
        }
    }

    async getProductById(id) {
        const productos = await this.leerArchivo();
        const producto = productos.filter((producto) => producto.id === id);
        return producto;
    }
    
    async deleteProduct(id) {
        let existe = false;
        const productos = await this.leerArchivo();
        const productosFiltrados = productos.filter((producto) => {
            if(producto.id != id){
                return producto;
            }
            existe = true;
        });
        this.escribirEnArchivo(productosFiltrados);
        return existe;
    }

    validarDatos(title,description,code,price,stock,category){
        if (!title || !description || !code || !price || !stock || !category ) {
            //console.log('los valores title ,description ,code ,price ,stock ,category son obligatorios');
            return true;
        }
        return false;
    }    

    async updateProductById(id,title,description,code,price,status,stock,category,thumbnails) {
        const productos = await this.leerArchivo();
       
        if(!price && price != 0){
            price = undefined;
        }
        if(!stock && stock != 0){
            stock = undefined;
        }
        const productosActualizado = productos.filter((producto) => {
            if(producto.id === id){
                producto.title = (title != undefined)? title : producto.title;
                producto.description = (description != undefined)? description : producto.description;
                producto.code = (code != undefined)? code : producto.code;
                producto.price = (price!= undefined)? price : producto.price;
                producto.status = (status != undefined)? status : producto.status;
                producto.stock = (stock!= undefined)? stock: producto.stock ;
                producto.category = (category != undefined)? category : producto.category;               
                producto.thumbnails = (thumbnails != undefined)? thumbnails : producto.thumbnails;              
            }
            return producto;
        });
        this.escribirEnArchivo(productosActualizado);
        return true;
    }

    async obtenerUltimoID() {  
        if (fs.existsSync(this.#path) && ProductManager.id === 1) {
            const contenidoArchivo = await this.leerArchivo();
            if(contenidoArchivo.length){
                let newID = contenidoArchivo.reduce((prev,current) => {
                    let ultimoID = prev.id > current.id ? prev : current;
                    return ultimoID;
                });
                ProductManager.id = newID.id + 1 ;
            }
        }
    }
}


