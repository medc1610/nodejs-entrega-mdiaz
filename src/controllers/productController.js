import productModel from '../models/product.js';

export const getProducts = async (limit, page, filter, sort) => {

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
    return await productModel.paginate(query, {limit: limi, page: pag, sort: ordQuery})
}

export const getProduct = async (id) => {
    return productModel.findById(id);
}

export const createProduct = async (product) => {
   return productModel.create(product);
}

export const updateProduct = async (id, product) => {
    return productModel.findByIdAndUpdate(id, product);
}

export const deleteProduct = async (id) => {
    await productModel.findByIdAndDelete(id);
}
