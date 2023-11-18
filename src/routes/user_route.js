import { Router } from "express";
import { Astrologist } from "../models/astroligist_model.js";
import { User } from "../models/user_model.js";
const router = Router();

router.get("/all-astrologist", async (req, res) => {
  console.log("as astro called");
  try {
    var astrologists = await Astrologist.find();
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

router.get("/user-details", async (req, res) => {
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

export { router as userRoute };
