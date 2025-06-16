import * as yup from "yup";

const userResetPassword = yup
  .object({
      password: yup
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message:
          "Password must include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
      }),
      cPassword: yup
      .string()
      .trim()
      .required("Please confirm your password")
      .oneOf([yup.ref('password'), null], "Passwords must match"),
  });

export default userResetPassword;