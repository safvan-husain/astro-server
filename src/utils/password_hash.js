import bcrypt from "bcryptjs";

export class Password {

  static async hashPassword(password) {
    if(password == null) {
      throw ('password is null')
    }
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePasswords(
    enteredPassword,
    hash
  ) {
    return bcrypt.compare(enteredPassword, hash);
  }
} 