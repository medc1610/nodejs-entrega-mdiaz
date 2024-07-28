import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
const productoCollection = 'products';

const productoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
 
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [],
  },
  owner: {
    type: String,
    required: true,
    default: 'admin',
  }
});
productoSchema.plugin(mongoosePaginate);
const productoModel = mongoose.model(productoCollection, productoSchema);
export { productoModel };