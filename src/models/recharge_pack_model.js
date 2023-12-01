import mongoose from "mongoose";

const rechargePackSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  extraOffer: String,
});

rechargePackSchema.statics.fromJSON = async function (json) {
  const { amount, extraOffer } = json;
  let pack = await this.findOne({ amount });

  if (pack) {
    pack.extraOffer = extraOffer;
    await pack.save();
  } else {
    pack = await this.create({ amount, extraOffer });
  }

  return pack;
};

const RechargePack = mongoose.model("RechargePack", rechargePackSchema);

export { RechargePack };
