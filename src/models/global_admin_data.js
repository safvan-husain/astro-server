import mongoose from "mongoose";

const adminDataSchema = new mongoose.Schema({
  premiumPrice: { type: String, default: "0" },
  premiumContent: [{ type: String, required: true }],
  revenue: { type: Number, default: 0 },
  number_of_transactions: { type: Number, default: 0 },
  number_of_api_calls: { type: Number, default: 0 },
  notifications: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  isRazorpay: { type: Boolean, default: true },
  banner: [
    {
      image: { type: String, required: true },
      link: { type: String, default: "" },
    },
  ],
});

adminDataSchema.statics.addBanner = async function (obj) {
  let data = await this.find();
  if (data.length > 0) {
    data[0].banner.push(obj);
    await data[0].save();
  } else {
    data = new this({ banner: [obj] });
    await data.save();
  }
};

adminDataSchema.statics.deleteBanner = async function (image) {
  let data = await this.find();
  if (data.length > 0) {
    data[0].banner = data[0].banner.filter(banner => banner.image !== image);
    await data[0].save();
  }
};

adminDataSchema.statics.increaseApiCalls = async function () {
  let data = await this.find();
  if (data.length > 0) {
    data[0].number_of_api_calls += 1;
    await data[0].save();
  } else {
    data = new this({});
    await data.save();
  }
};

adminDataSchema.statics.isRazorpay = async function () {
  var data = await this.find();
  if (data.length > 0) {
    return data[0].isRazorpay;
  } else {
    data = new this({});
    await data.save();
    return true;
  }
};

adminDataSchema.statics.getPremiumPrice = async function () {
  var data = await this.find();
  if (data.length > 0) {
    return parseInt(data[0].premiumPrice);
  }
  data = new this({});
  await data.save();
  return null;
};

adminDataSchema.statics.getNumbers = async function () {
  var data = await this.find();
  if (data.length > 0) {
    return {
      revenue: data[0].revenue,
      number_of_transactions: data[0].number_of_transactions,
      isRazorpay: data[0].isRazorpay,
      number_of_api_calls: data[0].number_of_api_calls,
    };
  }
  data = new this({});
  await data.save();
  return {
    revenue: 0,
    number_of_transactions: 0,
  };
};

adminDataSchema.statics.updateData = async function (updateObj) {
  const validKeys = [
    "premiumPrice",
    "premiumContent",
    "revenue",
    "number_of_transactions",
    "isRazorpay",
  ];
  const keys = Object.keys(updateObj);

  keys.forEach((key) => {
    if (!validKeys.includes(key)) {
      throw new Error(`Invalid property: `);
    }
  });

  var data = await this.find();
  if (data.length > 0) {
    keys.forEach((key) => {
      data[0][key] = updateObj[key];
    });
    await data[0].save();
  } else {
    var s = new this({});
    await s.save();
    keys.forEach((key) => {
      s[key] = updateObj[key];
    });
    await s.save();
  }
};

adminDataSchema.statics.addTransaction = async function (amount) {
  let data = await this.find();
  if (data.length > 0) {
    data[0].revenue += amount;
    data[0].number_of_transactions += 1;
    await data[0].save();
  } else {
    data = new this({ revenue: amount, number_of_transactions: 1 });
    await data.save();
  }
};

adminDataSchema.statics.getPremiumData = async function () {
  var data = await this.find();
  if (data.length > 0) {
    return {
      premiumPrice: data[0].premiumPrice,
      premiumContent: data[0].premiumContent,
    };
  } else {
    throw new Error("no admin data");
  }
};

const AdminData = mongoose.model("AdminData", adminDataSchema);

export { AdminData, adminDataSchema };
