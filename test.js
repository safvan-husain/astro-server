import { RechargePack } from "./src/models/recharge_pack_model.js";

async function save() {
    try {
        var re1 = await RechargePack.fromJSON({ amount: 100, extraOffer: "Extra 10%" });
        var re2 = await RechargePack.fromJSON({ amount: 200, extraOffer: "Extra 20%" });
        var re3 = await RechargePack.fromJSON({ amount: 300 });
    } catch (error) {
        console.error(error);
    }
}
save();

export { save }

// 2004-02-12T15:19:21+05:30