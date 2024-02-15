import { server as WebSocketServer } from "websocket";
import http from "http";
// import { sendMessage, makeCall } from "./push_notification";
import { WSMessageModel } from "./websocket_event.js";
import { Message } from "../models/message_model.js";
// import {
//   saveSendedMessage,
//   saveUnSendedMessage,
// } from "./database_message_methods.js";
import { CallSchedule } from "../models/call_shedule_model.js";
import { User } from "../models/user_model.js";
import { Astrologist } from "../models/astroligist_model.js";
import { MessageReplayTracker } from "./message_replay_tracker.js";
// import { saveMessageDB } from "./data_base_methods";

export function onWebSocket(server) {
  var webSockets = {};
  var connected_devices = [];
  var messageTracker = new MessageReplayTracker();

  // setInterval(()=> { messageTracker.removeUnReplayed() }, 10000)

  const wsServer = new WebSocketServer({
    httpServer: server,
  });

  wsServer.on("request", function (request) {
    var connection = request.accept(null, request.origin);
    var userID = request.resourceURL.path.substr(1);
    webSockets[userID] = connection;

    if (!connected_devices.includes(userID)) {
      connected_devices.push(userID);
      console.log(connected_devices);
      // for (const userID in webSockets) {
      //   webSockets[userID].sendUTF(
      //     JSON.stringify({
      //       cmd: "connected_devices",
      //       connected_devices: connected_devices,
      //     })
      //   );
      // }
    }

    connection.on("message", async function (message) {
      if (message.type === "utf8") {
        const obj = JSON.parse(message.utf8Data);
        if (obj.share) {
          await Astrologist.recieveProfile(obj);
        } else {
          if (WSMessageModel.isValidWSMessageModel(message.utf8Data)) {
            var ws_event = WSMessageModel.fromJson(message.utf8Data);
            // if (ws_event.event_type == EventType.message) {
            await messageTracker.onNewMessageOnWS(ws_event);
            // console.log(ws_event.message);
            var receiver = webSockets[ws_event.recieverphone];
            if (receiver != null) {
              //only get message if there is enough balance for the user
              var savedMessage = await Message.saveSendedMessage(
                ws_event.message,
                ws_event.senderphone,
                ws_event.recieverphone
              );
              if (savedMessage) {
                receiver.sendUTF(message.utf8Data);
              }
            } else {
              console.log(`${ws_event.recieverphone} is offline`);

              try {
                await Message.saveUnSendedMessage(
                  ws_event.message,
                  ws_event.senderphone,
                  ws_event.recieverphone
                );
              } catch (error) {
                console.log("error saving here at 74 websockrtsetu");
              }
            }
          } else {
            console.log("invalid message detected on websocket");
          }

          // } else {
          //   // console.log(ws_event.message);
          //   var receiver = webSockets[ws_event.recieverphone];
          //   if (receiver != null) {
          //     CallSchedule.createFromJson(ws_event.message, true)
          //       .then((doc) => console.log("Document saved:", doc))
          //       .catch((err) => console.error("Error saving document:", err));

          //     console.log(`sending call to ${ws_event.recieverphone} `);
          //     // saveSendedMessage(ws_event.message, ws_event.senderphone, ws_event.recieverphone);
          //     receiver.sendUTF(message.utf8Data);
          //   } else {
          //     CallSchedule.createFromJson(ws_event.message, false)

          //       .then((doc) => console.log("Document saved:", doc))
          //       .catch((err) => console.error("Error saving document:", err));

          //     // saveUnSendedMessage(ws_event.message, ws_event.senderphone, ws_event.recieverphone);
          //     console.log(`${ws_event.recieverphone} is offline`);
          //   }
          // }
        }
      }
    });

    connection.on("close", function () {
      delete webSockets[userID];
      console.log("User Disconnected: " + userID);
      var index = connected_devices.indexOf(userID);
      if (index > -1) {
        connected_devices.splice(index, 1);
      }
      console.log(connected_devices);
      // for (const userID in webSockets) {
      //   webSockets[userID].sendUTF(
      //     JSON.stringify({
      //       cmd: "connected_devices",
      //       connected_devices: connected_devices,
      //     })
      //   );
      // }
    });

    // connection.sendUTF(JSON.stringify({ cmd: "connected" }));
  });
}
