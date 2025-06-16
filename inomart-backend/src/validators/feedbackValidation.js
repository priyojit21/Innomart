import { z } from "zod";

export const feedbackValidation = z
  .object({
    rating: z.number().min(1).max(5),
    review: z.optional(
      z.string().trim().min(3, { message: "Minimum 3 letters are required." })
    ),
  })
  .strict();