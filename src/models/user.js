import { Schema, model } from "mongoose";
import { cartModel } from './cart.js';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'user'
    },
    cart_id: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    document: {
        type: Object,
        default: []
    },
    last_connection: {
        type: Date,
        default: Date.now()
    }


});

userSchema.pre('save', async function (next) {
    try {
        const cart = await cartModel.create({ products: [] });
        this.cart_id = cart._id;

        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre('find', async function(next) {
    try {
        this.populate('cart_id');
    } catch (error) {
        next(error);
    }
});

export const userModel = model('users', userSchema);


