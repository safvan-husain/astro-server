import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  to: { type: String, default: "general" }
});

notificationSchema.statics.findByPhone = async function(phone) {
  return this.find({
    $or : [
      { to: phone },
      { to: "general" }
    ]
  }).sort({ timestamp: -1 });
};

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
