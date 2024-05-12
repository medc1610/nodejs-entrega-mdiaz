import productModel from '../models/product.js';

export const getProducts = async (req, res) => {

    try {
        const {limit, page, filter, sort} = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 10;
        const order = sort !== undefined ? sort : 'asc';

        if (filter === 'true' || filter === 'false') {
            metFilter = 'status'
        } else if (filter !== undefined) {
            metFilter = 'category'
        }
        const query = metFilter ? {[metFilter]: filter} : {};
        const ordQuery = order !== undefined ? `sort: { price : ${order}}` : ""
        let prods = productModel.paginate(query, {limit: limi, page: pag, sort: ordQuery})

        res.status(200).send(prods.docs);
        // const prodsLimit = products.slice(0, limite);
        // res.render('templates/products', {
        //     mostrarProductos: true,
        //     prods: prodsLimit,
        //     css: 'home.css',
        // })
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}

export const getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id);
        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`);

    }
}

export const createProduct = async (req, res) => {
    try {
        if (req.user.role === 'Admin') {
            const product = req.body;
            const result = productModel.create(product);
            res.status(200).send(result);
        } else {
            res.status(403).send("Usuario no autorizado")
        }

    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}

export const updateProduct = async (req, res) => {
    try {
        if (req.user.role === 'Admin') {
            const id = req.params.id;
            const product = req.body;
            const result = productModel.findByIdAndUpdate(id, product);
            res.status(200).send(result)
        } else {
            res.status(403).send("Usuario no autorizado")
        }

    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        if (req.user.role === 'Admin') {
            const id = req.params.id;
            const result = productModel.findByIdAndDelete(id);
            res.status(200).send(result)

        }else {
            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}
