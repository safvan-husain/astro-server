import { Router } from "express";
import { CallSchedule } from "../models/call_shedule_model.js";
const router = Router();

router.post("/shedule-astro",async (req, res) => {
  const { email } = req.body;
  try {
    var shedule = await CallSchedule.find({ astroId: email, isSend: false });
    await CallSchedule.updateMany({  astroId: email, isSend: false }, { $set: { isSend: true } });
    res.status(200).json(shedule);
  } catch (error) {console.log(error);
    res.status(500).json({ message: "server crash" });
  }
});

router.post("/shedule-user",async (req, res) => {
  const { email } = req.body;
  try {
    var shedule = await CallSchedule.find({ userId: email, isSend: false  });
    await CallSchedule.updateMany({  userId: email , isSend: false }, { $set: { isSend: true } });
    res.status(200).json(shedule);
  } catch (error) {console.log(error);
    res.status(500).json({ message: "server crash" });
  }
});

export { router as SheduleRoute };