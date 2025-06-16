import { z } from "zod";

export const bankDetailsValidation = z
  .object({
    userName: z
      .string()
      .trim()
      .min(1, { message: "Account holder name is required." }),

    bankName: z.string().trim().min(1, { message: "Bank name is required." }),

    accountNumber: z
      .number()
      .int()
      .min(100000000, { message: "Invalid account number." })
      .max(999999999999, { message: "Invalid account number." }),

    ifscCode: z
      .string()
      .trim()
      .length(11, { message: "Not a valid IFSC code" })
      .regex(/^[A-Za-z]{4}0[0-9]{6}$/, {
        message: "Not a valid IFSC code",
      }),

    taxNumber: z
      .string()
      .trim()
      .length(15, { message: "Tax Number must be of 15 characters" })
      .regex(/^[0-9].*[0-9]$/, {
        message: "Tax Number must start and end with a number",
      })
      .regex(/^[0-9]+$/, {
        message: "Invalid Tax number",
      }),

    payoutMethod: z
      .string()
      .trim()
      .min(1, { message: "Payout method is required" }),
  })
  .strict();