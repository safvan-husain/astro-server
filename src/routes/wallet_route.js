import { Router } from "express";
import { RechargePack } from "../models/recharge_pack_model.js";
import { User } from "../models/user_model.js";import  Razorpay  from 'razorpay';
import dotenv from "dotenv";
const router = Router();

dotenv.config();

router.get("/all-packs", async (req, res) => {
  try {
    var packs = await RechargePack.find();
    if (packs != null) {
      res.status(200).json(packs);
    } else {
      res.status(400).json(JSON.stringify({ message: "could not get packs" }));
    }
  } catch (error) {
    res.status(400).json(JSON.stringify({ message: "server break" }));
  }
});

router.post("/recharge", async (req, res) => {console.log('recharge');
  const { phone, amount } = req.body;

  try {
    var user = await User.findOne({ phone: phone });
    if (user != null) {
      await user.increaseBalance(parseFloat(amount));
      res.status(200).json(user); 
    } else {
      res.status(400).json({ message: "could not get packs" });
    }
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "server break" });
  }
});

router.post("/recharge-order", async (req, res) => {
  console.log("recharge order");
  const { amount } = req.body;

  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET ,
    });

    var options = {
      amount: Number.parseInt(amount)*100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options).then(order => {
      res.status(200).json(order);
    }).catch(error => {
      console.log(err);
        res.status(500).json({message: "failed to create order!"})
    });
    
  } catch (error) {
    console.log(error);
    res.status(400).json(JSON.stringify({ message: "server break" }));
  }
});

export { router as walletRouter };
