import { Router } from "express";
import { Astrologist } from "../models/astroligist_model.js";
import { RechargePack } from "../models/recharge_pack_model.js";
import { User } from "../models/user_model.js";
import { Message } from "../models/message_model.js";
import { IssueModel } from "../models/issue_model.js";
import { ReviewModel } from "../models/day_review_model.js";
import { AdminData } from "../models/global_admin_data.js";
const router = Router();

router.post("/edit-user", async (req, res) => {
  const { phone, ...data } = req.body;
  try {
    const user = await User.findOne({ phone: phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    Object.assign(user, data);
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/add-banner", async (req, res) => {
  try {
    await AdminData.addBanner(req.body);
    res.status(200).json({ message: "Banner added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-banner", async (req, res) => {
  try {
    await AdminData.deleteBanner(req.body.image);
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/astrologist-all", async (req, res) => {
  try {
    var astrologist = await Astrologist.find();
    res.status(200).json(astrologist);
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
});

router.post("/update-payment", async (req, res) => {
  const { isRazorpay } = req.body;

  if (isRazorpay === undefined) {
    return res.status(400).send({ error: "isRazorpay value is required" });
  }

  try {
    await AdminData.updateData({ isRazorpay });
    res.status(200).send({ message: "isRazorpay value updated successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while updating isRazorpay value" });
  }
});

router.post("/update-premium-data", async (req, res) => {
  try {
    const { premiumPrice, premiumContent } = req.body;
    const data = await AdminData.find();
    if (data.length > 0) {
      data[0].premiumPrice = premiumPrice;
      data[0].premiumContent = premiumContent;
      await data[0].save();
      res.status(200).json(data[0]);
    } else {
      data = new AdminData({
        premiumPrice: premiumPrice,
        premiumContent: premiumContent,
      });
      await data.save();
      res.status(200).json(data[0]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/get-numbers", async (req, res) => {
  try {
    const numbers = await AdminData.getNumbers();
    const totalUsers = await User.countDocuments();
    res.status(200).json({ ...numbers, totalUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all-chat", async (req, res) => {
  try {
    const adminPhone = "admin"; // replace with actual admin phone

    var astro = await Astrologist.findOne({ phone: adminPhone });

    // Find users who have sent unsent messages to admin
    if (astro) {
      var usersUnsentAdmin = await User.find({
        phone: {
          $in: await Message.find({
            receiver: astro._id,
            isSendToReciever: false,
          }).distinct("senderEmail"),
        },
      }).sort({ isSubscribed: -1 });

      // Add isThereNewMessage property
      usersUnsentAdmin = usersUnsentAdmin.map((user) => {
        const userObj = user.toObject();
        userObj.isThereNewMessage = true;
        return userObj;
      });

      // Find users who haven't sent unsent messages to admin
      var usersSentAdmin = await User.find({
        phone: { $nin: usersUnsentAdmin.map((user) => user.phone) },
      }).sort({ isSubscribed: -1 });

      // Add isThereNewMessage property
      usersSentAdmin = usersSentAdmin.map((user) => {
        const userObj = user.toObject();
        userObj.isThereNewMessage = false;
        return userObj;
      });

      // Concatenate all user lists
      const users = [...usersUnsentAdmin, ...usersSentAdmin];

      res.status(200).json(users);
    } else {
      res
        .status(500)
        .json({ messages: "no astrologist on all chat admin route" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "database error" });
  }
});

router.get("/last-user-visit", async (req, res) => {
  const { phone } = req.query;
  try {
    var user = await User.findOne({ phone: phone });
    if (user != null) {
      await Message.updateMany(
        { sender: user._id },
        { $set: { isSendToReciever: true } }
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server crash" });
  }
});

router.get("/chat", async (req, res) => {
  const { phone } = req.query;
  try {
    var user = await User.findOne({ phone: phone });
    if (user) {
      var messages = await Message.find({
        $or: [{ sender: user._id }, { receiver: user._id }],
      });

      res.status(200).json(messages);
    } else {
      res.status(500).json({ message: "No user with this phone" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "database error" });
  }
});

router.get("/all-user", async (req, res) => {
  try {
    var astrologist = await User.find();
    res.status(200).json(astrologist);
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
});
router.get("/user-details", async (req, res) => {
  const { phone } = req.query;
  try {
    var user = await User.findOne({ phone: phone });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "no user exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "database error" });
  }
});

router.post("/approve", async (req, res) => {
  console.log("approved called");
  const { phone } = req.body;
  try {
    var astrologist = await Astrologist.findOne({ phone: phone });
    astrologist.adminApprovel = true;
    await astrologist.save();
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
});

router.post("/add-pack", async (req, res) => {
  console.log("add pack");
  try {
    await RechargePack.fromJSON(req.body);
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete-pack", async (req, res) => {
  console.log("delete pack");
  const { amount } = req.body;
  try {
    await RechargePack.findOneAndDelete({ amount });
  } catch (error) {
    console.log(error);
  }
});

router.post("/issue", async (req, res) => {
  console.log("issue");
  try {
    await IssueModel.fromJSON(req.body);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: "Error" });
    console.log(error);
  }
});

router.get("/issue", async (req, res) => {
  console.log("issue");
  try {
    var issues = await IssueModel.find();
    res.status(200).json(issues);
  } catch (error) {
    res.status(400).json({ message: "Error" });
    console.log(error);
  }
});

router.get("/day-review", async (req, res) => {
  console.log("day-review");
  try {
    var reviews = await ReviewModel.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ message: "Error" });
    console.log(error);
  }
});

router.post("/day-review", async (req, res) => {
  console.log("day-review");
  try {
    var review = await ReviewModel.fromJSON(req.body);
    if (review != null) {
      res.status(200).json({ message: "success" });
    } else {
      res
        .status(400)
        .json({ message: "Alredy submitted today, try again later" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error" });
    console.log(error);
  }
});

export { router as adminRouter };
