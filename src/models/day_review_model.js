import mongoose from "mongoose";

const dayReviewSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  isGood: { type: Boolean, required: true },
  description: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

dayReviewSchema.statics.fromJSON = async function (json) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextEntry = new Date(today);
  nextEntry.setHours(nextEntry.getHours() + 14);

  const existingReview = await this.findOne({
    phone: json.phone,
    date: {
      $gte: today,
      $lt: nextEntry,
    },
  });

  if (!existingReview) {
    return await this.create(json);
  } else {
    return null;
  }
};

const ReviewModel = mongoose.model("ReviewModel", dayReviewSchema);

export { ReviewModel };
