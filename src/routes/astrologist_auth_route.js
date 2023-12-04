import { Router } from "express";
import { Astrologist } from "../models/astroligist_model.js";
import { Password } from "../utils/password_hash.js";
// import { saveAstrologistDB } from "../utils/db_methods.js";
const router = Router();

router.post("/login-astro", async (req, res) => {
  console.log("login astro");
  try {
    const { phone, password } = req.body;
    var astrologist = await Astrologist.findOne({ phone: phone });

    if (astrologist == null) {
      res.status(409).json({ message: "No account exist with this phone" });
    } else {
      // if (await Password.comparePasswords(password, astrologist.password)) {
      //   await Astrologist.updateToken(req.body);

      // } else {
      //   res.status(400).json({ message: "Incorrect Password" });
      // }
      if (astrologist.adminApprovel === false) {
        res.status(409).json({ message: "Not yet Approved by admin" });
      } else {
        res.status(200).json(astrologist);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Oops! server failed!" });
  }
});

router.get("/astro", async (req, res) => {
  console.log("astro called");
  try {
    const { phone } = req.query;
    var astrologist = await Astrologist.findOne({ phone: phone });

    if (astrologist == null) {
      res.status(409).json({ message: "No account exist with this phone" });
    } else {
      res.status(200).json(astrologist);
    }
  } catch (error) {
    res.status(500).json({ message: "Oops! server failed!" });
  }
});

router.post("verify-phone", async (req, res) => {
  const { phone } = req.body;
  //send otp;
});

router.post("/register-astro", async (req, res) => {
  var otp = req.query.otp;
  if (otp !== "0000") {
    res.status(401).json({ message: "wrong otp" });
  } else {
    try {
      var astrologist = await Astrologist.findOne({ phone: req.body.phone });
      if (astrologist == null) {
        astrologist = await Astrologist.createProfile(req.body);
        res.status(200).json(astrologist);
      } else {
        res.status(400).json({ message: "Astrologist exist with this phone!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server break" });
    }
  }
});

router.post("/edit-astro", async (req, res) => {
  try {
    var astrologist = await Astrologist.findOne({ phone: req.body.phone });
    if (astrologist != null) {
      astrologist = await astrologist.updateProfile(req.body);
      res.status(200).json(astrologist);
    } else {
      res
        .status(400)
        .json({ message: "Astrologist do not exist with this phone!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server break" });
  }
});

export { router as astrologistAuthRoute };
