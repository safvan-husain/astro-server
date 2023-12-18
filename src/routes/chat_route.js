import { Router } from "express";
import { Message } from "../models/message_model.js";
import { Astrologist } from "../models/astroligist_model.js";
import { User } from "../models/user_model.js";
const router = Router();

router.get("/astro-chat", async (req, res) => { console.log("called");
  const { phone } = req.query;
  try {
    var messages = await Message.getMessagesByPhone(phone);
    await Message.updateMany(
      { receiverEmail: phone },
      { $set: { isSendToReciever: true } }
    );
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server crash" });
  }
});

router.get("/all-astro-chat", async (req, res) => {
  try {
    var astrologers = await Astrologist.find({phone: "admin"});
    if(astrologers.length > 0) {
      res.status(200).json(astrologers[0]);  
    } else {
      console.log("No admin created");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server crash" });
  }
});

// router.get("/chat-fee", async (req, res) => {
//   console.log("chat-fee called");
//   const { phone } = req.query;

//   try {
//     var astro = await Astrologist.findOne({ phone: phone });
//     if (astro != null) {
//       res.status(200).json(astro.chatFees);
//     } else {
//       res.status(400).json({ message: "No astrologist exist" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "server break" });
//   }
// });

// router.post("/see-profile", async (req, res) => {
//   console.log("profile called");
//   const { phone, userPhone } = req.body;
// console.log(req.body );
//   try {
//     var astro = await Astrologist.findOne({ phone: phone });
//     if (astro != null) {
//       if(astro.userModelIds.includes(userPhone)) {
//         var user = await User.findOne({ phone: userPhone })
//         res.status(200).json(user.getProfile())
//       } else {
//         res.status(400).json(JSON.stringify({ message: "No access, request to get acsess!"}))
//       }
//     } else {
//       res.status(400).json({ message: "No astrologist exist" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "server break" });
//   }
// });

router.post("/token-refresh", async (req, res) => {
  try {
    await Astrologist.updateToken(req.body);
    await User.updateToken(req.body);
  } catch (error) {
    console.log(error);
  }
});

export { router as chatRoute };
