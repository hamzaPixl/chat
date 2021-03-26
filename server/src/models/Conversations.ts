import paginate from 'mongoose-paginate-v2';
import { Schema, model } from 'mongoose';

import Messages from './Messages';

const Conversation = new Schema({
  messages: {
    type: [Messages.schema],
    required: false,
  },
  room: {
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

Conversation.plugin(paginate);

export default model('Conversations', Conversation);
