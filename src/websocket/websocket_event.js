

export class WSMessageModel {
  constructor({
    message,
    senderphone,
    recieverphone,
  }) {
    this.message = message;
    this.senderphone = senderphone;
    this.recieverphone = recieverphone;
  }

  toMap() {
    return {
      message: this.message,
      senderphone: this.senderphone,
      recieverphone: this.recieverphone,
    };
  }

  static fromMap(map) {
    return new WSMessageModel({
      message: map.message,    
      senderphone: map.senderphone,
      recieverphone: map.recieverphone,
    });
  }

  toJson() {
    return JSON.stringify(this.toMap());
  }

  static fromJson(source) {
    return WSMessageModel.fromMap(JSON.parse(source));
  }

  static isValidWSMessageModel(jsonString) {
    try {
        const obj = JSON.parse(jsonString);
        return obj.hasOwnProperty('message') && obj.hasOwnProperty('senderphone') && obj.hasOwnProperty('recieverphone');
    } catch (e) {
        return false;
    }
}
}

