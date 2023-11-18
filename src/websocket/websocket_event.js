export class WSEvent {
  message;
  senderEmail;
  recieverEmail;

  constructor(message, senderEmail, recieverEmail) {
    this.message = message;
    this.senderEmail = senderEmail;
    this.recieverEmail = recieverEmail;
  }

  static fromJson(jsonObject) {
    var map = JSON.parse(jsonObject);
    return new WSEvent(
      map["message"],
      map["senderEmail"],
      map["recieverEmail"]
    );
  }
  ///used
  toJson() {
    return JSON.stringify({
      message: this.message,
      senderEmail: this.senderEmail,
      recieverEmail: this.recieverEmail,
    });
  }
}

// No need for import 'dart:convert'; as it's not applicable in JavaScript

export const EventType = {
  message: "message",
  call: "call",
};

export const CallState = {
  completed: "completed",
  requested: "requested",
  sheduled: "sheduled",
  none: "none",
};

export class WSMessageModel {
  constructor({
    message,
    senderEmail,
    recieverEmail,
    type = EventType.message,
    callState = CallState.none,
  }) {
    this.message = message;
    this.senderEmail = senderEmail;
    this.recieverEmail = recieverEmail;
    this.type = type;
    this.callState = callState;
  }

  toMap() {
    return {
      message: this.message,
      senderEmail: this.senderEmail,
      recieverEmail: this.recieverEmail,
      callState: {
        completed: "completed",
        requested: "requested",
        sheduled: "sheduled",
        none: "none",
      }[this.callState],
      type: {
        message: "message",
        call: "call",
      }[this.type],
    };
  }

  static fromMap(map) {
    return new WSMessageModel({
      message: map.message,
      senderEmail: map.senderEmail,
      recieverEmail: map.recieverEmail,
      callState: {
        completed: CallState.completed,
        requested: CallState.requested,
        sheduled: CallState.sheduled,
      }[map.callState],
      type: {
        message: EventType.message,
        call: EventType.call,
      }[map.type],
    });
  }

  toJson() {
    return JSON.stringify(this.toMap());
  }

  static fromJson(source) {
    return WSMessageModel.fromMap(JSON.parse(source));
  }
}

