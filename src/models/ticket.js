import { Schema, model } from 'mongoose'

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purshaser: {
        type: String,
        required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'products'
        }
    ]

})

const ticketModel = model('tickets', ticketSchema)

export default ticketModel
