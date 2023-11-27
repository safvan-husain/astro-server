// // import { DataBaseException } from "../exception/exceptions";
// // import { Message, MessageModel } from "../model/message_model";
// import { Astrologist } from "../models/astroligist_model.js";
// import { Password } from "./password_hash.js";
// import { User } from "../models/user_model.js";

// // async function saveMessageDB(
// //   id,
// //   recieverUsername,
// //   messageText,
// //   isIdUsername
// // ) {
// //   try {
// //     let user;
// //     if (isIdUsername) {
// //       user = await User.findOne({ username: id });
// //     } else {
// //       user = await User.findById(id);
// //     }
// //     let reciever = await User.findOne({ username: recieverUsername });
// //     if (user && reciever) {
// //       let message = new MessageModel({
// //         senderId: user.username,
// //         receiverId: recieverUsername,
// //         msgText: messageText,
// //       });
// //       console.log(message);

// //       await message.save();
// //       console.log("messege saved");
// //     }
// //   } catch (error) {
// //     console.log(error);

// //     throw new DataBaseException();
// //   }
// // }

// // async function deleteAllMessagesDB(id) {
// //   try {
// //     let user = await User.findById(id);
// //     if (user) {
// //       let messages = await MessageModel.find({ senderId: user.username });
// //       for (let message of messages) {
// //         await MessageModel.findByIdAndDelete(message._id);
// //       }
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     throw new DataBaseException();
// //   }
// // }

// // async function getAllUnredMessagesDB(id){
// //   try {
// //     let user = await User.findById(id);
// //     if (user) {
// //       return await MessageModel.find({
// //         receiverId: user.username,
// //         isRead: false,
// //       });
// //     }
// //     throw new DataBaseException();
// //   } catch (error) {
// //     console.log(error);
// //     throw new DataBaseException();
// //   }
// // }

// async function updateUserDB(id, updatedData) {
//   try {
//     let user = await User.findById(id);
//     if (user) {
//       for (let prop in updatedData) {
//         user[prop] = updatedData[prop];
//       }
//       await user.save();
//       return user;
//     } else {
//       throw new Error("User not found");
//     }
//   } catch (error) {
//     console.log(error);
//     throw new DataBaseException();
//   }
// }

// async function registerUserDB({
//   phone,
//   firstName,
//   lastName,
//   password,
//   birthDate,
//   birthTime,
//   gender,
// }) {
//   let user;
//   if (password != null) {
//     var hash = await Password.hashPassword(password);

//     user = new User({
//       phone: phone,
//       password: hash,
//       firstname: firstName,
//       lastname: lastName,
//       accountType: "normal",
//       birthDate: birthDate,
//       birthTime: birthTime,
//       gender: gender,
//     });
//   } else {
//     user = new User({
//       phone: phone,
//       password: hash,
//       firstname: firstName,
//       lastname: secondName,
//       accountType: "normal",
//       birthDate: birthDate,
//       birthTime: birthTime,
//       gender: gender,
//     });
//   }

//   try {
//     await user.save();
//     return user;
//   } catch (error) {
//     console.log(error);
//     throw new DataBaseException();
//   }
// }

// async function saveAstrologistDB({
//   phone,
//   firstName,
//   lastName,
//   password,
//   astroType,
//   fees,
//   discription,
// }) {
//   if (discription == null) {
//     throw "disc null here";
//   }
//   let astrologist;
//   if (password != null) {
//     var hash = await Password.hashPassword(password);

//     astrologist = new Astrologist({
//       phone: phone,
//       password: hash,
//       firstName: firstName,
//       lastName: lastName,
//       astroType: astroType,
//       fees: fees,
//       description: discription,
//     });
//   } else {
//     astrologist = new Astrologist({
//       phone: phone,
//       firstName: firstName,
//       lastName: lastName,
//       astroType: astroType,
//       fees: fees,
//       description: discription,
//     });
//   }

//   try {
//     await astrologist.save();
//     return astrologist;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // async function markMessagesReaded(messages) {
// //   try {
// //     for (let message of messages) {
// //       message.isRead = true;
// //       await message.save();
// //     }
// //   } catch (error) {
// //     console.log(error);
// //   }
// // }
// export {
//   // registerUserDB,
//   saveAstrologistDB,
//   // updateUserDB,
//   // other exports...
// };
