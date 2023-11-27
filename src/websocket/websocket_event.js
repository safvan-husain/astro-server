
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
    senderphone,
    recieverphone,
    event_type = EventType.message,
    callState = CallState.none,
    chatFee
  }) {
    this.message = message;
    this.senderphone = senderphone;
    this.recieverphone = recieverphone;
    this.event_type = event_type;
    this.callState = callState;
    this.chatFee = chatFee;
  }

  toMap() {
    return {
      message: this.message,
      chatFee: this.chatFee,
      senderphone: this.senderphone,
      recieverphone: this.recieverphone,
      callState: {
        completed: "completed",
        requested: "requested",
        sheduled: "sheduled",
        none: "none",
      }[this.callState],
      event_type: {
        message: "message",
        call: "call",
      }[this.event_type],
    };
  }

  static fromMap(map) {
    return new WSMessageModel({
      message: map.message,
      chatFee: map.chatFee,
      senderphone: map.senderphone,
      recieverphone: map.recieverphone,
      callState: {
        completed: CallState.completed,
        requested: CallState.requested,
        sheduled: CallState.sheduled,
      }[map.callState],
      event_type: {
        message: EventType.message,
        call: EventType.call,
      }[map.event_type],
    });
  }

  toJson() {
    return JSON.stringify(this.toMap());
  }

  static fromJson(source) {
    return WSMessageModel.fromMap(JSON.parse(source));
  }
}

