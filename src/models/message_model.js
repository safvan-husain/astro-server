import mongoose, { Schema } from "mongoose";
import { User } from "./user_model.js";
import { Astrologist } from "./astroligist_model.js";

function getCurrentIST() {
  var currentIST = new Date();
  currentIST.setHours(currentIST.getHours() + 5);
  currentIST.setMinutes(currentIST.getMinutes() + 30);
  return currentIST;
}

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
    default: getCurrentIST,  
  },
});

messageSchema.statics.saveUnSendedMessage = async function (
  message,
  sender,
  reciever
) {
  if (!message || !sender || !reciever) {
    throw new Error(
      `Null Argument: ${
        !message
          ? "message"
          : !sender
          ? "sender"
          : !reciever
          ? "reciever"
          : "chatFee"
      }`
    );
  }
  var user = await User.findOne({ phone: sender });
  var astro = await Astrologist.findOne({ phone: reciever });

  if (user != null && astro != null) {
    //if the sender is user send notification to astro
    await astro.NotifyMessage(`Message from ${user.firstname}`, message);
    await user.deductFromBalance(astro.chatFees);
    await astro.increaseEarnings(); 
  } else {
    //if the sender is astrologist send notification to user
    user = await User.findOne({ phone: reciever });
    astro = await Astrologist.findOne({ phone: sender });

    if (user != null && astro != null) {
      await user.NotifyMessage(`Message from ${astro.firstName}`, message);
      // await user.deductFromBalance(chatFee);
      // await astro.increaseEarnings(chatFee);
    }
  }
  var message = new this({
    senderEmail: sender,
    receiverEmail: reciever,
    isSendToReciever: false,
    content: message,
  });
  try {
    await message.save();
  } catch (error) {
    console.log(error);
  }
};

messageSchema.statics.saveSendedMessage = async function (
  message,
  sender,
  reciever
) {
  console.log("saving unsend message");
  if (!message || !sender || !reciever) {
    throw new Error(
      `Null Argument: ${
        !message
          ? "message"
          : !sender
          ? "sender"
          : !reciever
          ? "reciever"
          : "chatFee"
      }`
    );
  }
  var user = await User.findOne({ phone: sender });
  var astro = await Astrologist.findOne({ phone: reciever });

  if (user != null && astro != null) {
    //if the sender is user send notification to astro
    await astro.NotifyMessage(`Message from ${user.firstname}`, message);
    await user.deductFromBalance(astro.chatFees);
    await astro.increaseEarnings();
  } else {
    //if the sender is astrologist send notification to user
    user = await User.findOne({ phone: reciever });
    astro = await Astrologist.findOne({ phone: sender });

    if (user != null && astro != null) {
      await user.NotifyMessage(`Message from ${astro.firstName}`, message);
      // await user.deductFromBalance(astro.chatFees);
      // await astro.increaseEarnings(chatFee);
    } 
  }

  var message = new this({
    senderEmail: sender,
    receiverEmail: reciever,
    isSendToReciever: true,
    content: message,
  });

  try {
    await message.save();
  } catch (error) {
    console.log(error);
  }
};

messageSchema.statics.deleteUnReplayedMessage = async function (
  sender,
  reciever,
  message
) {
  console.log(`'deleteing message  ${sender} ${reciever} ${message}`);
  if (!message || !sender || !reciever) {
    throw new Error(
      `Null Argument: ${!message ? "message" : !sender ? "sender" : "reciever"}`
    );
  }
  try {
    var msg = await this.findOne({
      senderEmail: sender,
      receiverEmail: reciever,
      content: message,
    }).sort({ timestamp: -1 });
    if (msg != null) {
      console.log(`"message found on database for delete`);
      await this.deleteOne({ _id: msg._id });
      var astro = await Astrologist.findOne({ phone: reciever });
      var user = await User.findOne({ phone: sender });
      user.increaseBalance(astro.chatFees);
      await astro.decreaseAChatFee();
    } else {
      console.log("no message found on database for delte");
    }
  } catch (error) {
    console.log(error);
  }
};

const Message = mongoose.model("Message", messageSchema);

export { Message };
