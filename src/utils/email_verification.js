import { Auth } from "two-step-auth";

async function login(emailId) {
  try {
    const res = await Auth(emailId, "Astro app");
    console.log(res);
    console.log(res.mail);
    console.log(res.OTP);
    console.log(res.success);
  } catch (error) {
    console.log(error);
  }
}
login("m.safvan27@gmail.com");
