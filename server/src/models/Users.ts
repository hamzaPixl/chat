import config from 'config';
import paginate from 'mongoose-paginate-v2';
import { Schema, model, Document } from 'mongoose';

const User = new Schema({
  username: {
    unique: true,
    type: String,
    index: true,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  salt: {
    type: String,
    required: false,
  },
  general: {
    email: {
      type: String,
      unique: true,
      index: true,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    birthdate: {
      type: Date,
      required: false,
    },
  },
  activity: {
    lastLogging: {
      type: Date,
      required: false,
      default: Date.now,
    },
    lastResetPassword: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  settings: {
    timezone: {
      type: String,
      required: false,
      default: config.get('defaultTimezone'),
    },
    status: {
      type: ['online', 'offline', 'busy'],
      required: false,
    },
  },
  contacts: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

User.plugin(paginate);

export interface IGeneral extends Document {
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
}

export interface IActivity extends Document {
  lastResetPassword: Date;
  lastLogging: Date;
}

export interface ISettings extends Document {
  timezone: string;
  status: string;
}

export interface IUser extends Document {
  username: string;
  password: string;
  salt: string;
  settings: ISettings;
  activity: IActivity;
  general: IGeneral;
  contacts: string[];
}

export default model<IUser>('Users', User);
