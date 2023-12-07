import { Router } from "express";
import { User } from "../models/user_model.js";
import { Password } from "../utils/password_hash.js";
import { OtpServices } from "../utils/otp_service.js";

const router = Router();
const otpService = OtpServices.getInstance();

router.post("/sendOtp", async (req, res) => {
  const { phone } = req.body;
  try {
    res.status(200); 
    // await otpService.sendOTP(phone, res);
  } catch (error) {
    console.log(error);
  }
});

router.get("/forgot", async (req, res) => {
  const { otp, phone } = req.query;

})

router.post("/change-password", async (req, res) => {
  const { phone, password } = req.body;
  try {
    var user = await User.findOne({ phone: phone });
    if (user == null) {
      res.status(409).json({ message: "No account exist with this phone" });
    } else {
      var hashed = await Password.hashPassword(password);
      user.password = hashed;
      await user.save();
      res.status(200).json(user)
    }
  } catch (error) {
    res.status(509).json({ message: "server crash" });   
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    var user = await User.findOne({ phone: phone });
    if (user == null) {
      res.status(409).json({ message: "No account exist with this phone" });
    } else {
      if (await Password.comparePasswords(password, user.password)) {
        await User.updateToken(req.body);

        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "Incorrect Password" });
      }
    }
  } catch (error) {
    res.status(509).json({ message: "server crash" });   
    console.log(error);
  }

  // Authentication logic here
});

router.get("/log-latest", async (req, res) => {
  const { phone } = req.query;
  try {
    var user = await User.findOne({ phone: phone });
    if (user == null) {
      res.status(409).json({ message: "No account exist with this phone" });
    } else {
      // await User.updateToken(req.body);
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(509).json({ message: "server crash" });
    console.log(error);
  }

  // Authentication logic here
});

router.post("/register", async (req, res) => {
  var otp = req.query.otp;
  console.log(`register called and otp is ${otp}`);
  // const isValid = otpService.verifyOTP(req.body.phone, otp);
  const isValid = true ;
  if (!isValid) {
    res.status(401).json({ message: "wrong otp" });
  } else {
    try {
      var user = await User.findOne({ phone: req.body.phone });
      if (user == null) {
        user = await User.createProfile(req.body);
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "user exist" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server break" });
    }
  }
});

router.post("/edit-user", async (req, res) => {
  try {
    var user = await User.findOne({ phone: req.body.phone });
    if (user != null) {
      user = await user.updateProfile(req.body);
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: phone + " user do not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

// router.post("/register-firebase", async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     phone,
//     birthDate,
//     birthTime,
//     // birthPlace,
//     gender,
//   } = req.body;
//   try {
//     var user = await User.findOne({ phone: phone });
//     if (user == null) {
//       user = await registerUserDB(req.body);
//       res.status(200).json(user);
//     } else {
//       res.status(400).json({ message: phone + " user exist" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "server break" });
//   }
// });

export { router as authRoutes };
