import * as yup from "yup";

const userForgetPassword = yup
  .object({
      email: yup
      .string()
      .email("The email is not a valid one")
      .required("Email is required")
  });

export default userForgetPassword;