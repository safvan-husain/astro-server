import mongoose from "mongoose";

const adminDataSchema = new mongoose.Schema({
  premiumPrice: { type: String, required: true },
  premiumContent: [{ type: String, required: true }],
  revenue: { type: Number, required: true },
  number_of_transactions: { type: Number, required: true },
  notifications: [{
    title: { type: String, required: true },
    description: { type: String, required: true }
  }]
});

adminDataSchema.statics.getPremiumPrice = async function () {
  var data = await this.find()
  if(data.length > 0) {
    return parseInt(data[0].premiumPrice);
  }
  return null;
};

adminDataSchema.statics.getNumbers = async function () {
  var data = await this.find()
  if(data.length > 0) {
    return {
      revenue: data[0].revenue,
      number_of_transactions: data[0].number_of_transactions
    };
  }
  return null;
};


adminDataSchema.statics.updateData = async function (updateObj) {
  const validKeys = ['premiumPrice', 'premiumContent', 'revenue', 'number_of_transactions'];
  const keys = Object.keys(updateObj);
  
  keys.forEach(key => {
    if (!validKeys.includes(key)) {
      throw new Error(`Invalid property: `);
    }
  });

  const data = await this.find();
  if (data.length > 0) {
    keys.forEach(key => {
      data[0][key] = updateObj[key];
    });
    await data[0].save();
  }
};

adminDataSchema.statics.addTransaction = async function (amount) {
  let data = await this.find();
  if (data.length > 0) {
    data[0].revenue += amount;
    data[0].number_of_transactions += 1;
  } else {
    data = new this({
      premiumPrice: "0",
      premiumContent: [],
      revenue: amount,
      number_of_transactions: 1,
    });
  }
  await data[0].save();
};

adminDataSchema.statics.getPremiumData = async function () {
  var data = await this.find()
  if(data.length > 0) {
    return {
      premiumPrice: data[0].premiumPrice,
      premiumContent: data[0].premiumContent
    };
  }
  return null;
};

const AdminData = mongoose.model("AdminData", adminDataSchema);

export { AdminData, adminDataSchema };