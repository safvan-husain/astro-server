import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  senderEmail: {
    type: String,
    required: true,
  },
  receiverEmail: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isSendToReciever: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);

export { Message };
