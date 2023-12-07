import unirest from "unirest";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.FAST2SMS_KEY_SECRET;

export class OtpServices {
  static instance = null;

  static getInstance() {
    if (!OtpServices.instance) {
      OtpServices.instance = new OtpServices();
    }
    return OtpServices.instance;
  }

  constructor() {
    if (OtpServices.instance) {
      return OtpServices.instance;
    }
    this.otps = new Map();
  }

  async sendOTP(phone, resp) {
    if (!phone || phone.length !== 10) {
      // replace with your phone number validation logic
      resp.status(400).send("Invalid phone number");
      return;
    }

    let otp = Math.floor(1000 + Math.random() * 9000);
    var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

    req.query({
      authorization: `${key}`,
      variables_values: `${otp}`,
      route: "otp",
      numbers: phone,
    });

    req.headers({
      "cache-control": "no-cache",
    });

    try {
        const response = await new Promise((resolve, reject) => {
            req.end(function (res) {
                if (res.error) reject(res.error);
                resolve(res.body);
            });
        });
        resp.status(200).json({message: "success"});  
        console.log(response);
        this.otps.set(phone, `${otp}`);
        return response;
    } catch (error) {
        resp.status(400).send("Failed to send OTP");
        console.error(error);
    }
  }

  verifyOTP(phone, otp) {
    if (this.otps.has(phone) && this.otps.get(phone) === otp) {
      console.log("correct otp");
      this.otps.delete(phone); // remove otp after successful verification
      return true;
    }
    console.log("incorrect otp");
    return false;
  }
}
