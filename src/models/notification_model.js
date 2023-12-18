import mongoose from "mongoose";
import { User } from "./user_model.js";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  to: { type: String, default: "general" }
});

notificationSchema.statics.createNotification = async function(data) {
  // Check if 'to' field exists in the data
  if (data.phone) {
    var user = await User.findOne({ phone: phone});
    if(user) {
      user.NotifyMessage(data.title, data.description)
    }
    // Perform your action here
  } else {
    await User.notifyAllUsers(data.title, data.description);
  }

  // Create a new notification
  const notification = new this(data);
  return await notification.save();
};

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
