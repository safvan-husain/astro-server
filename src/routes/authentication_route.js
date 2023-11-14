import { Router } from "express";
import { User } from "../models/user_model.js";
import { registerUserDB } from "../utils/db_methods.js";
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  var user = await User.findOne({ email: email });
  if (user == null) {
    res.status(409).json({ message: "No account exist with this email" });
  } else {
    res.status(200).json({ message: email + "user exist" });
  }
  // Authentication logic here
});
router.post("/login-firebase", async (req, res) => {
  const { email } = req.body;
  var user = await User.findOne({ email: email });
  if (user == null) {
    res.status(409).json({ message: "No account exist with this email" });
  } else {
    res.status(200).json({ message: email + "user exist" });
  }
  // Authentication logic here
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

  var user = await User.findOne({ email: email });
  if (user == null) {
    //   await registerUserDB(email, password);
    //   res.status(200).json({ message: email + "user is null" });
  } else {
    res.status(400).json({ message: email + " user exist" });
  }
  res.status(400).json({ message: "not implimented" });
});

router.post("/guru-register", (req, res) => {
  const { username, password } = req.body;
});

export { router as authRoutes };
