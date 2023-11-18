import { server as WebSocketServer } from "websocket";
import http from "http";
// import { sendMessage, makeCall } from "./push_notification";
import { WSEvent } from "./websocket_event.js";
import { log } from "console";
import { saveSendedMessage , saveUnSendedMessage} from "./database_message_methods.js";
// import { saveMessageDB } from "./data_base_methods";

export function onWebSocket(server) {
  var webSockets = {};
  var connected_devices = [];

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

    connection.on("message", function (message) {
      if (message.type === "utf8") {
        console.log(message.utf8Data);
        var ws_event = WSEvent.fromJson(message.utf8Data);
        var receiver = webSockets[ws_event.recieverEmail];
        if (receiver != null) {
          saveSendedMessage(ws_event.message, ws_event.senderEmail, ws_event.recieverEmail);
          receiver.sendUTF(message.utf8Data);
        } else {
          console.log(ws_event.toJson());
          saveUnSendedMessage(ws_event.message, ws_event.senderEmail, ws_event.recieverEmail);
          console.log(`${ws_event.recieverEmail} is offline`);
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
