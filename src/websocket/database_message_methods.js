import { Message } from "../models/message_model.js";
const saveSendedMessage = async ( message, sender, reciever ) => {
  if (!message || !sender || !reciever) {
    throw new Error(
      `Null Argument: ${!message ? "message" : !sender ? "sender" : "reciever"}`
    );
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

const saveUnSendedMessage = async ( message, sender, reciever ) => {
  if (!message || !sender || !reciever) {
    throw new Error(
      `Null Argument: ${!message ? "message" : !sender ? "sender" : "reciever"}`
    );
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
