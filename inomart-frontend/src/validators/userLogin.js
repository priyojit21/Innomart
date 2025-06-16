import * as yup from "yup";

const userLoginSchema = yup
  .object({
      email: yup
      .string()
      .email("The email is not a valid one")
      .required("Email is required"),
      password: yup
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")

  });

export default userLoginSchema;