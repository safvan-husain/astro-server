import fast2sms from "fast-two-sms";
import dotenv from "dotenv";
import unirest from "unirest";

dotenv.config();

const key = process.env.FAST2SMS_KEY_SECRET;

  var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

  req.query({
    "authorization": `${key}`,
    "variables_values": "5599",
    "route": "otp",
    "numbers": "7907320942"
  });
  
  req.headers({
    "cache-control": "no-cache"
  });
  
  
  req.end(function (res) {
    if (res.error) throw new Error(res.error);
  
    console.log(res.body);
  }); 

 

// fast2sms.sendMessage(options).then(response=> {
//     console.log(response);
//     console.log('after response');
// }).catch(error=> {
//     console.log(error); 
// }) 