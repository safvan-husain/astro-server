import { Password } from "./src/utils/password_hash.js";


Password.hashPassword("123").then(s=> console.log(s));