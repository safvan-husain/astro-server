import { Router } from "express";
import { Astrologist } from "../models/astroligist_model.js";
import { User } from "../models/user_model.js";
const router = Router();

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

router.post("/rate-astrologist",async (req, res) => {
  try {
    await Astrologist.addRating(req.body);
    res.status(200)
  } catch (error) {
    console.log(error);
    res.status(500)
  }
})

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

router.post("/astro-details", async (req, res) => {
  console.log("astro-details called");
  const { email } = req.body;

  try {
    var astro = await Astrologist.findOne({ phone: email }); 
    if (astro != null) {
      res
        .status(200)
        .json(astro);
    } else {
      res.status(400).json({ message: "No astrologist exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

export { router as userRoute };
