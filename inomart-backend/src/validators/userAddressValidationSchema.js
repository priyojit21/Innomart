import z from "zod";

export const userAddressValidation = z
  .object({
    country: z.string().trim().min(1, "Country is required."),
    street: z.string().trim().min(1, "Street is required."),
    name: z.string().trim().min(1, "Name is required."),
    landMark: z.optional(z.string().trim().min(1, "Landmark is required.")),
    city: z.string().trim().min(1, "City is required."),
    state: z.string().trim().min(1, "State is required."),
    pinCode: z
      .number()
      .int()
      .min(100000, "Invalid pin code.")
      .max(999999, "Invalid pin code."),
    type: z.optional(z.enum(["Home", "Office"])),
    houseNo: z
      .string()
      .trim()
      .min(1, { message: "House no is required." })
      .regex(/^[a-zA-Z0-9]+([/]?[a-zA-Z0-9]+)*$/, {
        message: "Wrong house no format.",
      }),
  })
  .strict();
