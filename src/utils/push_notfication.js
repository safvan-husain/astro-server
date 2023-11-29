import * as dotenv from "dotenv";
import FCM from 'fcm-node';
dotenv.config();

var serverKey = process.env.SERVER_KEY; //put your server key here



export class PushNotification { 
    
    constructor() {
      if (!PushNotification._instance) {
        this.fcm = new FCM(serverKey ); 
        PushNotification._instance = this;
      }
      return PushNotification._instance;
    }


    async sendMessage({token, title,message,}) {
        var message = {
            to: token, 
            notification: {
                title: title, 
                body: message 
            },
        };
 
        this.fcm.send(message, function(err, response){
            if (err) {
                console.log(err);
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    }
   }
   