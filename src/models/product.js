import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true
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

const productModel= model('products', productSchema);
