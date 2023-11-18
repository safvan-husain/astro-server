import { Router } from "express";
import { User } from "../models/user_model.js";
import { registerUserDB } from "../utils/db_methods.js";
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    var user = await User.findOne({ email: email });
    if (user == null) {
      res.status(409).json({ message: "No account exist with this email" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(509).json({ message: "server crash" });
    console.log(error);
  }

  // Authentication logic here
});
router.post("/login-firebase", async (req, res) => {
  const { email } = req.body;
  var user = await User.findOne({ email: email });
  if (user == null) {
    res.status(409).json({ message: "No account exist with this email" });
  } else {
    res.status(200).json(user);
  }
});

router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    birthDate,
    birthTime,
    // birthPlace,
    gender,
  } = req.body;
  try {
    var user = await User.findOne({ email: email });
    if (user == null) {
      user = await registerUserDB(req.body);
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: email + " user exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

router.post("/register-firebase", async (req, res) => {
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
    var user = await User.findOne({ email: email });
    if (user == null) {
      user = await registerUserDB(req.body);
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: email + " user exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "server break" });
  }
});

router.post("/guru-register", (req, res) => {
  const { username, password } = req.body;
});

export { router as authRoutes };
