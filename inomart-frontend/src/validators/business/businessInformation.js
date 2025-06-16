import * as yup from "yup";

const businessInformationValidationSchema = yup.object().shape({
  storeName: yup.string().trim().min(1, "Store Name is Required."),

  type: yup
    .string()
    .oneOf(["Individual", "Small Business", "Company"], "Invalid Type")
    .nullable(),

  registrationNumber: yup
    .number()
    .typeError("Registration Number is required")
    .integer("Registration Number must be an integer")
    .min(100000, "Registration Number must be at least 6 digits."),

  address: yup.string().trim().min(1, "Address is Required."),

  zipCode: yup
    .number()
    .typeError("Zip code is required")
    .integer("Zip code should be an integer")
    .min(100000, "Zip code should be 6 digits.")
    .max(999999, "Zip code should be 6 digits."),
});

export default businessInformationValidationSchema;
