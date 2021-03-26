import paginate from 'mongoose-paginate-v2';
import { Schema, model, Document } from 'mongoose';

import Messages, { IMessage } from './Messages';

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

export interface IConversation extends Document {
  messages: IMessage[];
  isDeleted: boolean;
  room: string;
  createdAt: Date;
}

export default model<IConversation>('Conversations', Conversation);
