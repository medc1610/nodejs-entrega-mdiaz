import mongoose from 'mongoose';

const mensajeCollection = 'messages';

const mensajeSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
});

const mensajeModel = mongoose.model(mensajeCollection, mensajeSchema);
export { mensajeModel };