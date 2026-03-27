import { body } from "express-validator";

export const registerValidation = [
 body("username")
  .trim()
  .escape()
  .withMessage("Username provided is invalid"),
 body("email")
  .isEmail()
  .withMessage("Invalid email format")
  .custom(email => {
    if (!email.endsWith("@eastminster.ac.uk")) {
      throw new Error("Only university email addresses are allowed (@eastminster.ac.uk)");
    }
    return true;
  }),
  body("password")
   .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
   })
   .withMessage("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a symbol")
   .escape(),
];