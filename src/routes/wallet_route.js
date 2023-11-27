import { Router } from "express";
import { RechargePack } from "../models/recharge_pack_model.js";
import { User } from "../models/user_model.js";

const router = Router();

router.get("/all-packs", async (req, res) => {
    try {
        var packs = await RechargePack.find();
        if(packs != null ) {
            res.status(200).json(packs)
        } else {
            
            res.status(400).json(JSON.stringify({ message: "could not get packs"})) 
        } 
    } catch (error) {
        res.status(400).json(JSON.stringify({ message: "server break"})) 
    }
});

router.post("/recharge", async (req, res) => {
    const { phone, amount } = req.body;

    try {
        var user = await User.findOne({ phone: phone });
        if(user != null ) {
            await user.increaseBalance(20);  
            res.status(200).json(user)
        } else {

            res.status(400).json(JSON.stringify({ message: "could not get packs"}))
        }
    } catch (error) {
        res.status(400).json(JSON.stringify({ message: "server break"}))
    }
});


export { router as walletRouter }