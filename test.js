import { Password } from "./src/utils/password_hash.js";

async function save() {
    console.log(await Password.hashPassword("pass"));
}

save();