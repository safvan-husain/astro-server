import { server as WebSocketServer } from 'websocket';
import http from 'http';
// import { sendMessage, makeCall } from "./push_notification";
import { WSEvent } from "./websocket_event.js";
import { log } from 'console';
// import { saveMessageDB } from "./data_base_methods";

export function onWebSocket(server) {
  var webSockets = {};
  var connected_devices = [];

  const wsServer = new WebSocketServer({
    httpServer: server
  });

  wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var userID = request.resourceURL.path.substr(1);
    webSockets[userID] = connection;

    if (!connected_devices.includes(userID)) {
      connected_devices.push(userID);
      console.log(connected_devices);
      for (const userID in webSockets) {
        webSockets[userID].sendUTF(
          JSON.stringify({
            cmd: "connected_devices",
            connected_devices: connected_devices,
          })
        );
      }
    }

    connection.on('message', function(message) {
      console.log("there is a message");
      if (message.type === 'utf8') {
        var ws_event = WSEvent.fromJson(message.utf8Data);
        var receiver = webSockets[ws_event.receiverUsername];
        if (receiver != null) {
          console.log(
            `${ws_event.eventName} from ${ws_event.senderUsername} to ${ws_event.receiverUsername}`
          );
          switch (ws_event.eventName) {
            case "message":
              // sendMessage({
              //   title: ws_event.senderUsername,
              //   body: ws_event.data ?? "",
              //   username: ws_event.receiverUsername,
              // });
              var response = ws_event.toJson();
              receiver.sendUTF(response);
              break;
            default:
              receiver.sendUTF(ws_event.toJson());
              break;
          }
        } else {
          if (ws_event.eventName === "message") {
            console.log(ws_event.data);

            // sendMessage({
            //   title: ws_event.senderUsername,
            //   body: ws_event.data ?? "",
            //   username: ws_event.receiverUsername,
            // });
            // saveMessageDB(
            //   ws_event.senderUsername,
            //   ws_event.receiverUsername,
            //   ws_event.data ?? "",
            //   true
            // );
          } else if (ws_event.eventName === "request") {
            makeCall(ws_event.receiverUsername, ws_event.senderUsername);
          }
        }
      }
    });

    connection.on('close', function() {
      delete webSockets[userID];
      console.log("User Disconnected: " + userID);
      var index = connected_devices.indexOf(userID);
      if (index > -1) {
        connected_devices.splice(index, 1);
      }
      console.log(connected_devices);
      for (const userID in webSockets) {
        webSockets[userID].sendUTF(
          JSON.stringify({
            cmd: "connected_devices",
            connected_devices: connected_devices,
          })
        );
      }
    });

    connection.sendUTF(JSON.stringify({ cmd: "connected" }));
  });
}