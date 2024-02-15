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
  senderPhone: {
    type: String,
    required: true,
  },
  receiverPhone: {
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
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});




messageSchema.statics.getMessagesByPhone = async function(phone) {

  var user = await User.findOne({ phone: phone});
  if(user!=null) {
    const messages = await this.find({
      $or: [{ sender: user._id }, { receiver: user._id }]
    });
  
    return messages.map(message => ({
      text: message.content,
      isSentByMe: message.sender.equals(user._id),
      chatId: "admin",
      timestamp: message.timestamp.toISOString(),
    }));
  } else {
    console.log("user is null in getmessagebyphone message model");
  }
  
};

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
    if(user.balance < astro.chatFees){
      return null;
    }
    //if the sender is user send notification to astro
    await astro.NotifyMessage(`Message from ${user.firstname}`, message);
    await user.deductFromBalance(astro.chatFees);

    var message = new this({
      senderPhone: sender,
      receiverPhone: reciever,
      isSendToReciever: false,
      content: message,
      sender: user._id,
      receiver: astro._id,
    });
  } else {
    //if the sender is astrologist send notification to user
    user = await User.findOne({ phone: reciever });
    astro = await Astrologist.findOne({ phone: sender });

    if (user != null && astro != null) {
      await user.NotifyMessage(`Message from ${astro.firstName}`, message);
      var message = new this({
        senderPhone: sender,
        receiverPhone: reciever,
        isSendToReciever: false,
        content: message,
        sender: astro._id,
        receiver: user._id,
      });
    }
  }

  try {
    return await message.save();
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
    var message = new this({
      senderPhone: sender,
      receiverPhone: reciever,
      isSendToReciever: false,
      content: message,
      sender: user._id,
      receiver: astro._id, 
    });
    return;//added
  } else {
    //if the sender is astrologist send notification to user
    user = await User.findOne({ phone: reciever });
    astro = await Astrologist.findOne({ phone: sender });

    if (user != null && astro != null) {
      await user.NotifyMessage(`Message from ${astro.firstName}`, message);
      var message = new this({
        senderPhone: sender,
        receiverPhone: reciever,
        isSendToReciever: false,
        content: message,
        sender: astro._id,
        receiver: user._id,
      });
    } 
    return;//added
  }
  console.log("error on the messagemodel");

  // var message = new this({
  //   senderPhone: sender,
  //   receiverPhone: reciever,
  //   isSendToReciever: true,
  //   content: message,
  // });

  try {
    await message.save();
  } catch (error) {
    console.log(error);
  }
};

const Message = mongoose.model("Message", messageSchema);

export { Message };
