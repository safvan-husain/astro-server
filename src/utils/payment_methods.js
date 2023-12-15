import crypto from "crypto";
import utf8 from "utf8";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const receipt = process.env.RAZORPAY_RECIEPT;
const merchantId = process.env.PHONE_PE_MERCHAND_ID;
const merchantUserId = process.env.PHONE_PE_MERCHAND_USER_ID;
const merchantTransactionId = process.env.PHONE_PE_MERCHAND_TRANSACTION_ID;
const environment = process.env.PHONE_PE_ENVIOURMENT;
const appId = process.env.PHONE_PE_APP_ID;
const mobileNumber = process.env.PHONE_PE_MOBILE_NO;
const salt = process.env.PHONE_PE_SALT;
const index = parseInt(process.env.PHONE_PE_SALT_INDEX);
const apiEndPoint = process.env.PHONE_PE_API_END_POINT;

var razorpay_instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function payWithRazorPay(amount, res) {
  var options = {
    amount: amount, // amount in the smallest currency unit
    currency: "INR",
    receipt: receipt,
  };

  try {
    var order = await razorpay_instance.orders.create(options);
    res.status(200).json({ isRazorpay: true, order: order });
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "failed to create order!" });
  }
}

export function payWithPhonePe(amount, res) {
  var body = getBody(amount);
  var checksum = getCheckSum(amount);

  res.status(200).json({
    isRazorpay: false,
    body: body,
    checksum: checksum,
    environment: environment,
    appId: appId,
    merchantId: merchantId,
  });
}

export function getCheckSum(amount) {
  const concatenatedString = getBody(amount) + apiEndPoint + salt;

  const hash = crypto
    .createHash("sha256")
    .update(utf8.encode(concatenatedString))
    .digest("hex");

  return hash + "###" + index.toString();
}

export function getBody(amount) {
  const body = {
    merchantId: merchantId,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: merchantUserId,
    amount: amount,
    mobileNumber: mobileNumber,
    callbackUrl: "",
    paymentInstrument: { type: "PAY_PAGE" },
  };

  // Encode the request body to JSON
  const jsonBody = JSON.stringify(body);
  const base64EncodedBody = Buffer.from(jsonBody, "utf8").toString("base64");

  return base64EncodedBody;
}
