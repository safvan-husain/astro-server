import mongoose, { Schema } from "mongoose";
import { PushNotification } from "../utils/push_notfication.js";

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
  birthDate: {
    type: String,
    required: true,
  },
  birthTime: {
    type: String,
    required: true,
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
    required: true,
  },
  balance: {
    required: true,
    type: Number,
  },
  token: {
    type: String,
  },
  isSubscribed : {
    type: Boolean,
    required: true,
  }
});

UserSchema.methods.NotifyMessage = async function (title, content) {
  const pushNotification = new PushNotification();
  await pushNotification.sendMessage({
    token: this.token,
    title: title,
    message: content,
  });
};

UserSchema.statics.updateToken = async function (data) {
  const { phone, token } = data;
  if (token != null) {
    console.log("token recieved");
    console.log(token);
    const user = await this.findOne({ phone: phone });
    if (user != null) {
      user.token = token;
      await user.save();
      console.log("token refreshed for a user");
    }
  } else {
    console.log("no token in usermodel");
  }
};

UserSchema.statics.isUser = async function( phone ) {
  var user = await this.findOne({ phone: phone})
  if(user!= null) {
    return true;
  }
  return false;
}

UserSchema.methods.updateProfile = function (data) {
  Object.assign(this, data);
  return this.save();
};

UserSchema.methods.deductFromBalance = function (amou) {
  var amount = parseFloat(amou);
  if (this.balance < amount) {
    throw new Error("Insufficient balance");
  }
  console.log(`before deducting ${amou}`);
  this.balance -= amount;
  return this.save();
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

UserSchema.statics.createProfile =async function (data) {
  const user = new this(data);
  return await user.save();
};

const User = mongoose.model("User", UserSchema);

export { User, UserSchema };
