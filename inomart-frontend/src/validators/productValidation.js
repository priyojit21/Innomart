import * as Yup from "yup";

export const productValidation = Yup.object().shape({
  productName: Yup.string().trim().required("Product name is required."),

  description: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .min(10, "At least 10 characters are required."),

  brandName: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .notRequired()
    .min(3, "At least 3 characters are required."),

  category: Yup.array()
    .of(Yup.string().trim().required("Category ID is required."))
    .min(1, "At least one category is required."),

  tags: Yup.array().of(Yup.string().trim()).optional(),

  variations: Yup.array()
    .of(
      Yup.object().shape({
        regularPrice: Yup.number()
          .typeError("Regular price must be a number.")
          .min(1, "Regular price must be >= 1.")
          .required("Regular price is required."),

        sellingPrice: Yup.number()
          .typeError("Selling price must be a number.")
          .min(1, "Selling price must be >= 1.")
          .required("Selling price is required."),

        discountType: Yup.mixed()
          .oneOf(
            ["Fixed", "Percentage"],
            "Please select a valid discount type (either 'Fixed' or 'Percentage')."
          )
          .notRequired(),

        discount: Yup.number()
          .typeError("Discount must be a number.")
          .min(0, "Discount must be >= 0.")
          .when(["discountType", "regularPrice"], {
            is: (discountType, regularPrice) => discountType === "Fixed",
            then: (schema) =>
              schema.max(
                Yup.ref("regularPrice"),
                "Fixed discount must not exceed regular price."
              ),
            otherwise: (schema) =>
              schema.max(100, "Percentage discount must not exceed 100."),
          })
          .notRequired(),

        stock: Yup.number()
          .typeError("Stock must be a number.")
          .min(1, "Stock must be >= 1.") 
          .notRequired(),

        skuId: Yup.string().trim().required("SKU ID is required."),

        details: Yup.array()
          .of(
            Yup.object().shape({
              key: Yup.string()
                .required("Key is required.")
                .test(
                  "key-validity",
                  "Key must be a valid string.",
                  (value) => typeof value === "string"
                ),
              value: Yup.string().when("key", {
                is: (key) => key && key.toLowerCase() === "color",
                then: () => Yup.string().notRequired(),
                otherwise: () => Yup.string().required("Value is required."),
              }),
            })
          )
          .test("unique-keys", "Keys must be unique.", (details) => {
            if (!details) return true;
            const keys = details.map((item) => item.key);
            const uniqueKeys = new Set(keys);
            return keys.length === uniqueKeys.size;
          })
          .notRequired(),
      })
    )
    .min(1, "At least one variation is required."),

  weight: Yup.number()
    .typeError("Weight must be a number.") 
    .min(1, "Weight must be >= 1.")
    .required("Weight is required."),

  dimensions: Yup.string()
    .trim()
    .matches(/^[1-9][0-9]*[a-z]+x[1-9][0-9]*[a-z]+x[1-9][0-9]*[a-z]+$/, {
      message: "Dimensions must be in the correct format.",
    })
    .required("Dimensions are required."),

  freeShipping: Yup.string()
    .trim()
    .min(1, "Must be at least 1 character long.") 
    .notRequired(),
  deliveryTime: Yup.string()
    .trim()
    .min(1, "Must be at least 1 character long.") 
    .notRequired(),
  shippingMethods: Yup.string()
    .trim()
    .min(1, "Must be at least 1 character long.") 
    .notRequired(),
  isEnabled: Yup.string()
    .trim()
    .min(1, "Must be at least 1 character long.") 
    .notRequired(),
});
