import { Router } from "express";
import { Astrologist } from "../models/astroligist_model.js";
import { saveAstrologistDB } from "../utils/db_methods.js";
const router = Router();

router.post("/login-astro", async (req, res) => {
  console.log("login astro");
  try {
    const { email, password } = req.body;
    var astrologist = await Astrologist.findOne({ email: email });
    if (astrologist == null) {
      res.status(409).json({ message: "No account exist with this email" });
    } else {
      res.status(200).json(astrologist);
    }
  } catch (error) {
    res.status(500).json({ message: "Oops! server failed!" });
  }
});

router.post("/register-astro", async (req, res) => {
  console.log("register astro called");
  const { email } = req.body;
  try {
    var astrologist = await Astrologist.findOne({ email: email });
    if (astrologist == null) {
      astrologist = await saveAstrologistDB(req.body);
      res.status(200).json(astrologist);
    } else {
      res.status(400).json({ message: "Astrologist exist with this email!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

router.post("/login-firebase-astro", async (req, res) => {
  console.log("login firebase astro called");
  const { email } = req.body;
  var astrologist = await Astrologist.findOne({ email: email });
  if (astrologist == null) {
    res.status(409).json({ message: "No account exist with this email" });
  } else {
    res.status(200).json(Astrologist);
  }
});
router.post("/register-firebase-astro", async (req, res) => {
  console.log("register firebase astro called");
  const {
    firstName,
    lastName,
    email,
    birthDate,
    birthTime,
    // birthPlace,
    gender,
  } = req.body;
  try {
    var astrologist = await Astrologist.findOne({ email: email });
    if (astrologist == null) {
      astrologist = await saveAstrologistDB(req.body);
      res.status(200).json(Astrologist);
    } else {
      res.status(400).json({ message: email + " Astrologist exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "server break" });
  }
});

router.post("/guru-register", (req, res) => {
  const { astrologistname, password } = req.body;
});

export { router as astrologistAuthRoute };
