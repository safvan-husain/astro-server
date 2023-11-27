import mongoose, { Schema } from "mongoose";

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
  }
});

UserSchema.methods.updateProfile = function (data) {
  Object.assign(this, data);
  return this.save();
};

UserSchema.methods.deductFromBalance = function(amount) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  this.balance -= amount;
  return this.save();
};

UserSchema.methods.getProfile = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.phone;
  delete obj.balance;
  return JSON.stringify(obj);
};

UserSchema.methods.increaseBalance = function(amount) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  this.balance += amount;
  return this.save();
};

UserSchema.statics.createProfile = function (data) {
  const user = new this(data);
  return user.save();
};

const User = mongoose.model("User", UserSchema);

export { User, UserSchema };
