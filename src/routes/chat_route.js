import { Router } from "express";
import { Message } from "../models/message_model.js";
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

export { router as chatRoute };
