import { z } from "zod";

export const businessValidation = z
  .object({
    storeName: z.string().trim().min(1, "Store Name is Required."),

    type: z.optional(z.enum(["Individual", "Small Business", "Company"])),

    registrationNumber: z
      .number()
      .int()
      .min(100000, "Registration Number must be at least 6 digits."),

    description: z
      .string()
      .trim()
      .min(5, "Description Must be minimum 5 characters.")
      .optional(),

    businessLicense: z
      .string()
      .trim()
      .min(1, "Business License is required.")
      .optional(),

    governmentIdType: z
      .enum(["Aadhaar Card", "Passport", "Driver's License", "PAN", "Voter ID"])
      .optional(),

    // governmentId: z
    //   .string()
    //   .trim()
    //   .min(1, "Government Id is required.")
    //   .optional(),
  })
  .strict();
