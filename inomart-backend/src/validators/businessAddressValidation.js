import z from "zod";

export const businessAddressValidation = z
  .object({
    country: z.string().trim().min(1, "Country is Required.").optional(),
    address: z.string().trim().min(1, "Address is Required."),
    zipCode: z
      .number()
      .int()
      .min(100000, "Zip code should be 6 digits.")
      .max(999999, "Zip code should be 6 digits."),
  })
  .strict();
