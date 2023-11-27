import { Router } from "express";
import { Message } from "../models/message_model.js";
import { Astrologist } from "../models/astroligist_model.js";
import { User } from "../models/user_model.js";
const router = Router();

router.post("/unread-messages",async (req, res) => {
  console.log("unread call");
  const { email } = req.body;
  try {
    var messages = await Message.find({ receiverEmail: email, isSendToReciever: false });
    await Message.updateMany({ receiverEmail: email, isSendToReciever: false }, { $set: { isSendToReciever: true } });
    res.status(200).json(messages);
  } catch (error) {console.log(error);
    res.status(500).json({ message: "server crash" });
  }
});

router.get("/chat-fee", async (req, res) => {
  console.log("chat-fee called");
  const { phone } = req.query;

  try {
    var astro = await Astrologist.findOne({ phone: phone });
    if (astro != null) {
      res.status(200).json(astro.chatFees);
    } else {
      res.status(400).json({ message: "No astrologist exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });   
  }
});

router.post("/see-profile", async (req, res) => {
  console.log("profile called");
  const { phone, userPhone } = req.query;

  try {
    var astro = await Astrologist.findOne({ phone: phone });
    if (astro != null) {
      if(astro.userModelIds.includes(userPhone)) {
        var user = await User.findOne({ phone: userPhone })
        res.status(200).json(user.getProfile())
      } else {
        res.status(400).json(JSON.stringify({ message: "No access, request to get acsess!"}))
      }
    } else {
      res.status(400).json({ message: "No astrologist exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });   
  }
});

export { router as chatRoute };
