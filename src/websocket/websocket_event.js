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
