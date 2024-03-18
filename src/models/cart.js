import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
                idProduct: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true

                },
                quantity: {
                    type: Number,
                    required: true
                }
            }

        ],
        default: []
    }
})

cartSchema.pre('findOne', function() {
    this.populate('products.idProduct');
})

export const cartModel = model('carts', cartSchema);
