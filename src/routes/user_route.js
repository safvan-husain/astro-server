import { Router } from "express";
import { Astrologist } from "../models/astroligist_model.js";
import { User } from "../models/user_model.js";
import { AdminData } from "../models/global_admin_data.js";
import dotenv from "dotenv";
dotenv.config();
const router = Router();

const apikey = process.env.PROKERALA_KEY;
const secret = process.env.PROKERALA_SECRET;

const userId = process.env.ASTROLOGY_API_USER_ID;
const password = process.env.ASTROLOGY_API_PASSWORD;


router.get('/banner', async (req, res) => {
  try {
    var data = await AdminData.find();
    res.status(200).json(data[0].banner);  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all-astrologist", async (req, res) => {
  console.log("as astro called");
  // await save();
  try {
    var astrologists = await Astrologist.find({ adminApprovel: true });
    if (astrologists != null) {
      res.status(200).json(astrologists);
    } else {
      res.status(400).json({ message: "No astrologist exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

router.get("/prokerala-credentials", async (req, res) => {
  console.log("prokerala");
  try {
    if (apikey === undefined || secret === undefined) {
      res.status(500).json({ message: "prokerala credentials undefined" });
    } else {
      res.status(200).json({ apiid: apikey, secret: secret });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

router.get("/astrology-credentials", async (req, res) => {
  console.log("prokerala");
  try {
    if (userId === undefined || password === undefined) {
      res.status(500).json({ message: "astrology credentials undefined" });
    } else {
      res.status(200).json({ userId: userId, password: password });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

router.post("/rate-astrologist", async (req, res) => {
  try {
    await Astrologist.addRating(req.body);
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/user-details", async (req, res) => {
  console.log("user-details called");
  const { email } = req.body;

  try {
    var user = await User.findOne({ email: email });
    if (user != null) {
      res
        .status(200)
        .json({ firstName: user.firstname, lastName: user.lastname });
    } else {
      res.status(400).json({ message: "No astrologist exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

router.get("/astro-details", async (req, res) => { 
  console.log("astro-details called");
  const { phone } = req.query;

  try {
    var astro = await Astrologist.findOne({ phone: phone });
    if (astro != null) {
      res.status(200).json(astro);
    } else {
      res.status(400).json({ message: "No astrologist exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});
//to check today writed diary or not
router.get("/reviewd", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingReview = await this.findOne({
      phone: req.query.phone,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    if (existingReview) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

export { router as userRoute };
