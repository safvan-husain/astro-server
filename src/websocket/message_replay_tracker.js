import { Message } from "../models/message_model.js";
import { User } from "../models/user_model.js";

export class MessageReplayTracker {
  constructor() {
    this.messages = new Map(); // Store messages with timestamp
  }

  async onNewMessageOnWS(es_event) {
    var isUser = await User.isUser(es_event.senderphone); 
    // console.log(isUser? "this is sended by a user"+ es_event.senderphone: "this is sender by a astrologist"+ es_event.senderphone); 
    if (isUser) {
      this.addMessage(
        es_event.senderphone,
        es_event.recieverphone,
        es_event.message
      );
    } else {
      this.removeMessage(es_event.recieverphone, es_event.senderphone);
    }
  }

  //only use this when the message sended by user
  addMessage(senderId, receiverId, message) {
    const timestamp = new Date();
    const messageKey = `${senderId}-key1-${receiverId}-key1-${message}`;

    // Add the new message with timestamp
    this.messages.set(messageKey, timestamp);
    console.log(`after adding message to replay tracker`);
    console.log(this.messages);
  }

  //only use this method when the message sended by astrologisst
  removeMessage( user, astro,) {
    console.log(`remove message for replay while message `);
    console.log(this.messages);
    // If the message is from a teacher, remove any existing message from the student to that teacher
    this.messages.forEach((value, key) => {
      const [existingSenderId, existingReceiverId, existingMsg] =
        key.split("-key1-");
      if (existingSenderId === user && existingReceiverId === astro) {
        console.log('this is a replay');
        this.messages.delete(key);
      } else {
        console.log(`${existingSenderId} : ${user} -- ${existingReceiverId}: astro`); 
      }
    });
    console.log(`after removing`);
    
    console.log(this.messages);
  }
 
  async removeUnReplayed() {
    const currentTime = new Date();
    const twoDaysAgo = new Date(currentTime.getTime() -  1000 * 15); // 48 hours ago 48 * 60 * 60 *

    for (let [key, value] of this.messages) {
      if (value <= twoDaysAgo) {
        console.log(`gonna delete ${key}`);  
        // Perform your async method here
        const [existingSenderId, existingReceiverId, existingMsg] =
          key.split("-key1-"); 
        await Message.deleteUnReplayedMessage( 
          existingSenderId,
          existingReceiverId,
          existingMsg
        );
        // Delete the message from the map
        this.messages.delete(key);
      }
    }
  }
}
