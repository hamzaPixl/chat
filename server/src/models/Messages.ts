import { Schema, model } from 'mongoose';

const Message = new Schema({
  body: {
    type: String,
    required: false,
  },
  from: {
    type: String,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Messages', Message);
