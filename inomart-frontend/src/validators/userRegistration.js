import * as yup from "yup";

const userSchema = yup.object({
  fName: yup
    .string()
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(20, "Name must be at most 20 characters")
    .matches(/^[A-Za-z]+( [A-Za-z]+)+$/, {
      message: "Name should be in the format 'Firstname Lastname'",
    }),
  email: yup
    .string()
    .email("The email is not a valid one")
    .required("Email is required"),
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
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  phoneNumber: yup
    .string()
    .trim()
    .length(10, "Phone number must be exactly 10 digits long.")
    .matches(/^[6-9]\d{9}$/, {
      message: "Phone number must start with only 6, 7, 8, or 9.",
    }),
});

export default userSchema;
