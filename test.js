import { AdminData } from "./src/models/global_admin_data.js";

export async function name() {
    try {
        var data = new AdminData({
            premiumPrice: '99',
            premiumContent: ["you will get details", "premium details"],
            revenue: 0,
            number_of_transactions: 0,
          });
          await data.save();
          console.log('created data');
        }
     catch (error) {
     console.log(error);   
    }
 
}
