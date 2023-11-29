import { Astrologist } from "../models/astroligist_model.js";
import { Message } from "../models/message_model.js";
import { User } from "../models/user_model.js";

const saveSendedMessage = async (message, sender, reciever, chatFee) => {
  if (!message || !sender || !reciever) {
    throw new Error(
      `Null Argument: ${!message ? "message" : !sender ? "sender" : "reciever"}`
    );
  }
  var user = await User.findOne({ phone: sender });
  var astro = await Astrologist.findOne({ phone: reciever });

  if (user != null && astro != null) {
    await user.NotifyMessage();
    await user.deductFromBalance(astro.chatFees);
    await astro.increaseEarnings(astro.chatFees);
  } else {
    user = await User.findOne({ phone: reciever });
    astro = await Astrologist.findOne({ phone: sender });

    if (user != null && astro != null) {
      await user.NotifyMessage();
      await user.deductFromBalance(astro.chatFees);
      await astro.increaseEarnings(astro.chatFees);
    }
  }

  var message = new Message({
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

const saveUnSendedMessage = async (message, sender, reciever, chatFee) => {
  if (!message || !sender || !reciever) {
    throw new Error(
      `Null Argument: ${!message ? "message" : !sender ? "sender" : "reciever"}`
    );
  }
  var user = await User.findOne({ phone: sender });
  var astro = await Astrologist.findOne({ phone: reciever });

  if (user != null && astro != null) {
    //if the sender is user send notification to astro
    await astro.NotifyMessage(`Message from ${user.firstname}`, message);
    await user.deductFromBalance(chatFee);
    await astro.increaseEarnings(chatFee);
  } else {
    //if the sender is astrologist send notification to user
    user = await User.findOne({ phone: reciever });
    astro = await Astrologist.findOne({ phone: sender });

    if (user != null && astro != null) {
      await user.NotifyMessage(`Message from ${astro.firstName}`, message);
      await user.deductFromBalance(chatFee);
      await astro.increaseEarnings(chatFee);
    }
  }
  var message = new Message({
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

export { saveSendedMessage, saveUnSendedMessage };
