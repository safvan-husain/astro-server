// import { DataBaseException } from "../exception/exceptions";
// import { Message, MessageModel } from "../model/message_model";
import { User, UserSchema } from "../models/user_model.js"; 
import { Password } from "./password_hash.js";
 
// async function saveMessageDB(
//   id,
//   recieverUsername,
//   messageText,
//   isIdUsername
// ) {
//   try {
//     let user;
//     if (isIdUsername) {
//       user = await User.findOne({ username: id });
//     } else {
//       user = await User.findById(id);
//     }
//     let reciever = await User.findOne({ username: recieverUsername });
//     if (user && reciever) {
//       let message = new MessageModel({
//         senderId: user.username,
//         receiverId: recieverUsername,
//         msgText: messageText,
//       });
//       console.log(message);

//       await message.save();
//       console.log("messege saved");
//     }
//   } catch (error) {
//     console.log(error);

//     throw new DataBaseException();
//   }
// }


// async function deleteAllMessagesDB(id) {
//   try {
//     let user = await User.findById(id);
//     if (user) {
//       let messages = await MessageModel.find({ senderId: user.username });
//       for (let message of messages) {
//         await MessageModel.findByIdAndDelete(message._id);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     throw new DataBaseException();
//   }
// }


// async function getAllUnredMessagesDB(id){
//   try {
//     let user = await User.findById(id);
//     if (user) {
//       return await MessageModel.find({
//         receiverId: user.username,
//         isRead: false,
//       });
//     }
//     throw new DataBaseException();
//   } catch (error) {
//     console.log(error);
//     throw new DataBaseException();
//   }
// }
async function registerUserDB(
  email,
  password,
) {

    var hash =await Password.hashPassword(password);

  let user = new User({
    email: email,
    password: hash,
    firstname: "safvan",
    lastname: "husain",
    accountType: "normal", 
  });
  try {
    user.save();
    return user;
  } catch (error) {
    console.log(error);
    throw new DataBaseException();
  }
}

// async function markMessagesReaded(messages) {
//   try {
//     for (let message of messages) {
//       message.isRead = true;
//       await message.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
export {
  registerUserDB,
//   deleteAllMessagesDB as deleteMessagesDB,
//   saveMessageDB,
//   getAllUnredMessagesDB,
//   markMessagesReaded,
};