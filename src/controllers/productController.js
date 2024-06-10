import productModel from '../models/product.js';
import { faker } from "@faker-js/faker";
export const getProducts = async (req, res) => {

    try {
        const {limit, page, filter, sort} = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 100;
        const order = sort !== undefined ? sort : 'asc';

        if (filter === 'true' || filter === 'false') {
            metFilter = 'status'
        } else if (filter !== undefined) {
            metFilter = 'category'
        }
        const query = metFilter ? {[metFilter]: filter} : {};
        const ordQuery = order !== undefined ? `sort: { price : ${order}}` : ""
        let prods = await productModel.paginate(query, {limit: limi, page: pag, sort: ordQuery})

        req.logger.info(`Se obtuvieron los productos correctamente: ${prods.docs} - ${new Date().toLocaleDateString()}`)
        res.status(200).send(prods.docs);
    } catch (error) {
        req.logger.error(`Error al obtener los productos ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}

export const getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id);
        if (product) {
            req.logger.info(`Se obtuvo el producto correctamente: ${product} - ${new Date().toLocaleDateString()}`)
            res.status(200).send(product);
        } else {
            req.logger.warning(`Producto no encontrado - ${new Date().toLocaleDateString()}`)
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        req.logger.error(`Error al obtener el producto ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);

    }
}

export const createProduct = async (req, res) => {
    try {
        if (req.user.role === 'Premium' || req.user.role === 'Admin') {
            const product = req.body;
            const result = productModel.create(product);
            req.logger.info(`Producto creado correctamente: ${result} - ${new Date().toLocaleDateString()}`)
            res.status(200).send(result);
        } else {
            req.logger.warning(`Usuario no autorizado - ${new Date().toLocaleDateString()}`)
            res.status(403).send("Usuario no autorizado")
        }

    } catch (error) {
        req.logger.error(`Error al crear el producto ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}

export const updateProduct = async (req, res) => {
    try {
        if (req.user.role === 'Premium' || req.user.role === 'Admin') {
            const id = req.params.id;
            const product = req.body;
            const result = productModel.findByIdAndUpdate(id, product);
            req.logger.info(`Producto actualizado correctamente: ${result} - ${new Date().toLocaleDateString()}`)
            res.status(200).send(result)
        } else {
            req.logger.warning(`Usuario no autorizado - ${new Date().toLocaleDateString()}`)
            res.status(403).send("Usuario no autorizado")
        }

    } catch (error) {
        req.logger.error(`Error al actualizar el producto ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        if (req.user.role === 'Premium' || req.user.role === 'Admin') {
            const id = req.params.id;
            const result = productModel.findByIdAndDelete(id);
            req.logger.info(`Producto eliminado correctamente: ${result} - ${new Date().toLocaleDateString()}`)
            res.status(200).send(result)
        }else {
            req.logger.warning(`Usuario no autorizado - ${new Date().toLocaleDateString()}`)
            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.error(`Error al eliminar el producto ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}
export const addMockProducts = (req, res) =>{
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
    req.logger.info(`Productos mock agregados correctamente: ${listProducts} - ${new Date().toLocaleDateString()}`)
    res.status(200).send(listProducts)
}

