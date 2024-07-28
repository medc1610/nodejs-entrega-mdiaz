import mongoose from 'mongoose';

const ticketCollection = 'ticket';

const ticketSchema = new mongoose.Schema({  
  code : {
    type : String,    
    required: true,
  },
  puchase_datetime : {
    type : Date,
    default : Date.now,
  },
  amount : {    
    type : Number,
    required : true,
  },
  puchaser : {
    type : String,    
    required: true,
  }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export { ticketModel };