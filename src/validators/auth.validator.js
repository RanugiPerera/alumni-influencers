import { body } from "express-validator";

export const registerValidation = [
 body("email")
  .isEmail()
  .withMessage("Invalid email format")
  .custom(email => {
    if (!email.endsWith("@westiminster.ac.uk")) {
      throw new Error("Only university email addresses are allowed");
    }
    return true;
  }),
];