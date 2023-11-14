import mongoose,{ Schema } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['gold', 'silver', 'normal'],
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

export { User, UserSchema }