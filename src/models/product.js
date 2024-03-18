import { Schema, model } from "mongoose";
import { paginate } from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    price: {
        type: String,
        default: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    thumbnail: {
        default: []
    }

})

productSchema.plugin(paginate);

export const productModel = model('products', productSchema);

