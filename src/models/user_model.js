import mongoose, { Schema } from "mongoose";
import { PushNotification } from "../utils/push_notfication.js";
import { Password } from "../utils/password_hash.js";

const UserSchema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  birthDateTime: {
    type: Number,
    required: true,
  },
  birthLocation: {
    name: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  avatarUrl: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ["single", "married", "divorced", "notSpecified"],
  },
  balance: {
    required: true,
    type: Number,
  },
  token: {
    type: String,
  },
  isSubscribed: {
    type: Date,
    default: null,
  },
});

UserSchema.methods.NotifyMessage = async function (title, content) {
  const pushNotification = new PushNotification();
  await pushNotification.sendMessage({
    token: this.token,
    title: title,
    message: content,
  });
};

UserSchema.statics.notifyAllUsers = async function (title, content) {
  const users = await this.find({});
  const pushNotification = new PushNotification();
  for (let user of users) {
    if (user.token) {
      await pushNotification.sendMessage({
        token: user.token,
        title: title,
        message: content,
      });
    }
  }
};

UserSchema.statics.updateToken = async function (data) {
  const { phone, token } = data;
  if (token != null) {
    const user = await this.findOne({ phone: phone });
    if (user != null) {
      user.token = token;
      await user.save();
      console.log("token refreshed for a user");
    }
  }
};

UserSchema.statics.isUser = async function (phone) {
  var user = await this.findOne({ phone: phone });
  if (user != null) {
    return true;
  }
  return false;
};

UserSchema.methods.updateProfile = async function (data) {
  Object.assign(this, data);
  return await this.save();
};

UserSchema.methods.deductFromBalance = async function (amou) {
  var amount = parseFloat(amou);
  if (this.balance < amount) {
    console.log("Insufficient balance");
    return;
  }
  this.balance -= amount;
  const result = await this.save();

  return result;
};

UserSchema.methods.getProfile = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.phone;
  delete obj.balance;
  delete obj.avatarUrl;
  delete obj._id;
  delete obj.__v;
  return JSON.stringify(obj);
};

UserSchema.methods.increaseBalance = async function (amou) {
  var amount = parseFloat(amou);
  this.balance += amount;
  return await this.save();
};

UserSchema.methods.subscribe = function () {
  const today = new Date();
  const subscriptionEndDate = new Date(today);
  subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
  this.isSubscribed = subscriptionEndDate;
  return this.save();
};

UserSchema.statics.createProfile = async function (data) {
  const hashed = await Password.hashPassword(data.password);
  data.password = hashed;
  const user = new this(data);
  return await user.save();
};

UserSchema.statics.unsubscribeAllUsers = async function () {
  await this.updateMany({}, { $set: { isSubscribed: null } });
};

const User = mongoose.model("User", UserSchema);

export { User, UserSchema };
