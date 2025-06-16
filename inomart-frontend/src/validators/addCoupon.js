import * as Yup from "yup";

export const couponValidation = Yup.object({
  minAmount: Yup.string()
  .matches(/^[0-9]/, "value must be a number")
    .min(1, "Minimum amount should be at least 1.")
    .required("Minimum amount is required."),

  offerDetails: Yup.string()
    .trim()
    .min(5, "Offer details must contain at least 5 characters.")
    .required("Offer details are required."),

  offerType: Yup.string()
    .oneOf(
      ["percentage", "flat"],
      'Offer type must be either "percentage" or "flat".'
    )
    .required("Offer type is required."),

  code: Yup.string()
    .trim()
    .min(4, "code must be minimum 4 characters")
    .matches(
      /^[A-Z][A-Z0-9]*$/,
      "Coupon must start with a letter and only contain uppercase letters and numbers."
    )
    .required("Coupon code is required."),

  amount: Yup.string()
    .matches(/^[0-9]/, "value must be a number")
    .min(1, "Amount should be at least 1.")
    .required("Amount is required.")
    .test(
      "valid-amount",
      "Amount must be greater than 1 for flat offers or between 1 and 100 for percentage offers.",
      function (value) {
        const offerType = this.parent.offerType;
        if (offerType === "flat") {
          return value > 1;
        }
        if (offerType === "percentage") {
          return value >= 1 && value <= 100;
        }
        return true;
      }
    ),

  isFirstTime: Yup.boolean().required(
    "isFirst Time is required and must be a boolean."
  ),

  customerLimit: Yup.string()
    .matches(/^[0-9]/, "value must be a number")
    .min(1, "Customer limit should be at least 1.")
    .required("Customer limit is required."),

  product: Yup.array()
    .of(Yup.string().trim().min(1, "Product ID is required."))
    .min(1, "At least one product is required.")
    .required("Product IDs are required."),

  category: Yup.array()
    .of(Yup.string().trim().min(1, "Category ID is required."))
    .min(1, "At least one category is required.")
    .required("Category IDs are required."),
});