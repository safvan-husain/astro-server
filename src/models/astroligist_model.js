import mongoose, { Schema, Types } from "mongoose";
import { User } from "./user_model.js";

const AstrologistSchema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  specialities: {
    type: [String],
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  chatFees: {
    type: Number,
    required: true,
  },
  callFees: {
    type: Number,
    required: true,
  },
  earnings: {
    type: Number,
    required: true,
  },
  collected: {
    type: Number,
    required: true,
  },
  adminApprovel: {
    type: Boolean,
    default: false,
  },
  userModelIds: [
    {
      type: String,
    },
  ],
});

AstrologistSchema.statics.getTotalEarningsAndCollected = async function () {
  const astrologists = await this.find({});
  let totalEarnings = 0;
  let totalCollected = 0;

  astrologists.forEach(astrologist => {
    totalEarnings += astrologist.earnings;
    totalCollected += astrologist.collected;
  });

  return {
    totalEarnings,
    totalCollected
  };
};


AstrologistSchema.methods.increaseEarnings = function (amount) {
  this.earnings += amount;
  return this.save();
};

AstrologistSchema.method.publicDetails = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.phone;
  delete obj.earnings;
  delete obj.userModelIds;
  delete obj.collected;
  return JSON.stringify(obj);
};
AstrologistSchema.statics.recieveProfile = async function (data) {
  const { sender, reciever } = data;
  console.log(sender, reciever);
  const user = await User.findOne({ phone: sender });
  const astrologist = await this.findOne({ phone: reciever });

  if (!user || !astrologist) {
    return Promise.reject(new Error("User or Astrologist not found"));
  }

  return astrologist.addUserModelId(sender);
};

AstrologistSchema.methods.addUserModelId = function (userModelId) {
  if (!this.userModelIds.includes(userModelId)) {
    this.userModelIds.push(userModelId);
    return this.save();
  }
  return this;
};

AstrologistSchema.methods.removeUserModelId = function (userModelId) {
  const index = this.userModelIds.indexOf(userModelId);
  if (index > -1) {
    this.userModelIds.splice(index, 1);
    return this.save();
  }
  return this;
};

AstrologistSchema.statics.createProfile = function (data) {
  const user = new this(data);
  return user.save();
};

AstrologistSchema.methods.updateProfile = function (data) {
  Object.assign(this, data);
  return this.save();
};

const Astrologist = mongoose.model("Astrologist", AstrologistSchema);

export { Astrologist };
