import { Router } from 'express';import { Astrologist } from "../models/astroligist_model.js"
import { RechargePack } from '../models/recharge_pack_model.js'
import { User } from '../models/user_model.js';
const router = Router();

router.get("/all-astrologist", async (req, res) => {
    try {
        var astrologist = await Astrologist.find()
        console.log(astrologist);
        res.status(200).json(astrologist);
    } catch (error) {
        res.status(500).json({ message: "database error"});
    }
})

router.get("/all-user", async (req, res) => {
    console.log("all-user called");
    try {
        var astrologist = await User.find()
        console.log(astrologist);
        res.status(200).json(astrologist);
    } catch (error) {
        res.status(500).json({ message: "database error"});
    }
})
router.get("/details", async (req, res) => {
    console.log("details called");
    var obj = {};
    try {
        var users = await User.find()

        obj["userCount"] = users.length;

        var astro = await Astrologist.find()

        obj["astroCount"] = astro.length;

        let total = await Astrologist.getTotalEarningsAndCollected()

        obj["totalEarnings"] = total.totalEarnings;
        obj["totalCollected"] = total.totalCollected;
        
        res.status(200).json(obj); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "database error"}); 
    }
})

router.post("/approve", async (req, res) => {
    console.log('approved called');
    const { phone } = req.body;
    try {
        var astrologist = await Astrologist.findOne({ phone: phone});
        astrologist.adminApprovel = true;
        await astrologist.save(); 
    } catch (error) {
        res.status(500).json({ message: "database error"});
    }
})

router.post('/add-pack', async (req, res) => {
    console.log("add pack");
    try {
        await RechargePack.fromJSON(req.body); 
    } catch (error) {
        
    }
})

router.post('/delete-pack', async (req, res) => {
    console.log("delete pack");
    const { amount } = req.body;
    try {
        await RechargePack.findOneAndDelete({ amount }); 
    } catch (error) {
        console.log(error);
    }
})

export { router as adminRouter }