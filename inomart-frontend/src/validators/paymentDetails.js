import * as yup from "yup";

const paymentDetailsSchema = yup.object({
  userName: yup
    .string()
    .trim()
    .min(1, "Account Holder Name is Required")
    .required("Account Holder Name is Required"), 

  accountNumber: yup.number()
    .min(100000000, "Account Number should be minimum 9 digits")
    .max(999999999999,"Account Number should be maximum 11 digits" )
    .required("Account Number is Required"),

    ifscCode: yup
      .string()
      .trim()
      .length(11,  "Not a valid IFSC code" )
      .matches(/^[A-Za-z]{4}0[0-9]{6}$/, "Not a valid IFSC code"),

      taxNumber: yup
      .string()
      .trim()
      .length(15,  "Tax Number must be of 15 characters" )
      .matches(/^[0-9].*[0-9]$/, {
        message: "Tax Number must start and end with a number",
      })
      .matches(/^[0-9]+$/, {
        message: "Invalid Tax number",
      })
      .required("Tax Number is Required"),

    
  
});

export default paymentDetailsSchema;
