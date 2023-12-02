import mongoose, { Schema, Types } from "mongoose";
import { User } from "./user_model.js";
import { PushNotification } from "../utils/push_notfication.js";

const AstrologistSchema = new Schema(
  {
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
    token: {
      type: String,
    },
    ratings: [
      {
        userPhone: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AstrologistSchema.statics.addRating = async function ({
  userPhone,
  astroPhone,
  rating,
}) {
  const astrologist = await this.findOne({ phone: astroPhone });
  if (astrologist != null) {
    const userRating = astrologist.ratings.find(
      (r) => r.userPhone === userPhone
    );

    if (userRating) {
      userRating.rating = rating;
    } else {
      astrologist.ratings.push({ userPhone, rating });
    }

    await astrologist.save();
  }
};

AstrologistSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) {
    return 0;
  }
  const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
  return sum / this.ratings.length;
});

AstrologistSchema.statics.updateToken = async function (data) {
  const { phone, token } = data;
  if (token != null) {
    const astrologist = await this.findOne({ phone: phone });
    astrologist.token = token;
    await astrologist.save();
  } else {
    console.log("token is null astro scema");
  }
};

AstrologistSchema.methods.NotifyMessage = async function (title, content) {
  const pushNotification = new PushNotification();
  await pushNotification.sendMessage({
    token: this.token,
    title: title,
    message: content,
  });
};

AstrologistSchema.statics.getTotalEarningsAndCollected = async function () {
  const astrologists = await this.find({});
  let totalEarnings = 0;
  let totalCollected = 0;

  astrologists.forEach((astrologist) => {
    totalEarnings += astrologist.earnings;
    totalCollected += astrologist.collected;
  });

  return {
    totalEarnings,
    totalCollected,
  };
};

AstrologistSchema.statics.updateToken = async function (data) {
  const { phone, token } = data;
  if (token != null) {
    console.log("token recieved");
    console.log(token);
    const astro = await this.findOne({ phone: phone });
    if (astro != null) {
      astro.token = token;
      await astro.save();
      console.log("token refreshed for a astro");
    }
  } else {
    console.log("no token in astromodel");
  }
};

AstrologistSchema.methods.increaseEarnings = async function () {
  this.earnings += this.chatFees;
  return await this.save();
};

AstrologistSchema.methods.decreaseAChatFee = async function () {

  this.earnings -= this.chatFees;
  return await this.save();
};

AstrologistSchema.methods.publicDetails = function () {
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
