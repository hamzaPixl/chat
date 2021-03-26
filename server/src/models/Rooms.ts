import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { nanoid } from 'nanoid';

import Conversations from './Conversations';

const Room = new Schema({
  conversation: {
    type: Conversations.schema,
    required: false,
  },
  shortId: {
    type: String,
    required: false,
    unique: true,
    defaul: nanoid(6),
  },
  title: {
    type: String,
    unique: true,
    required: false,
  },
  users: {
    type: [String],
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  tags: {
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

Room.plugin(paginate);

export interface IRoom extends Document {
}

export default model<IRoom>('Rooms', Room);
