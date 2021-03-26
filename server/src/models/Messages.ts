import { Schema, model, Document } from 'mongoose';

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

export interface IMessage extends Document {
}

export default model<IMessage>('Messages', Message);
