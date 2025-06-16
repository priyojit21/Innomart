import * as Yup from "yup";

export const userAddressValidation = Yup.object({
  country: Yup.string().min(1, "Country is required."),
  street: Yup.string().trim().min(1, "Street is required."),
  city: Yup.string().trim().min(1, "City is required."),
  state: Yup.string().trim().min(1, "State is required."),
  pinCode: Yup.string()
    .min(6, "PinCode must be 6 character")
    .max(6, "PinCode should be of 6 character")
    .matches(/^[1-9][0-9]*$/, {
      message: "PinCode should contain only Number",
    }),
  type: Yup.string().oneOf(["Home", "Office"], "Invalid address type."),
  name: Yup.string().trim().min(1, "Name is required."),
  landMark: Yup.string().trim().min(1, "Landmark is Required"),
  houseNo: Yup.string()
    .trim()
    .min(1, "House no is required.")
    .matches(/^[a-zA-Z0-9]+([/]?[a-zA-Z0-9]+)*$/, "Wrong house no format."),
}).strict();
