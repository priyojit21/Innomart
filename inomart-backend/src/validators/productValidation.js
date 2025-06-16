import { z } from "zod";

export const productValidation = z
  .object({
    productName: z
      .string()
      .trim()
      .min(1, { message: "Product name is required." }),

    brandName: z.string().trim().optional(),

    description: z.string().trim(),

    category: z
      .array(z.string().trim().min(1, { message: "Category ID is required." }))
      .min(1, { message: "At least one category is required." }),

    tags: z.array(z.string().trim().optional()).optional(),

    variations: z
      .array(
        z.string().superRefine((data, ctx) => {
          try {
            const parsed = JSON.parse(data);
            const schema = z.object({
              regularPrice: z
                .number()
                .min(1, { message: "Regular price must be >= 1." }),
              sellingPrice: z
                .number()
                .min(1, { message: "Selling price must be >= 1." }),
              discountType: z.enum(["Fixed", "Percentage"]).optional(),
              discount: z
                .number()
                .min(0, { message: "Discount must be >= 0." })
                .optional(),
              stock: z
                .number()
                .min(1, { message: "Stock must be >= 1." })
                .optional(),
              skuId: z
                .string()
                .trim()
                .min(1, { message: "SKU ID is required." }),
              details: z.string().refine((details) => {
                if (details) {
                  try {
                    JSON.parse(details);
                    return true;
                  } catch {
                    return false;
                  }
                }
                return true;
              }, "Invalid JSON format for details."),
            });

            schema.parse(parsed);
            return true;
          } catch (e) {
            if (e instanceof z.ZodError) {
              e.errors.forEach((issue) => {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: issue.message,
                  path: issue.path,
                });
              });
            } else {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Invalid JSON format or structure`,
              });
            }

            return false;
          }
        })
      )
      .min(1, { message: "At least one variation is required." }),

    weight: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]*[a-z]+$/, {
        message: "Weight must be in the format '5gm', '2kg', etc.",
      }),
    dimensions: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]*[a-z]+x[1-9][0-9]*[a-z]+x[1-9][0-9]*[a-z]+$/, {
        message: "Dimensions must be in the format '3cmx5cmx8cm'.",
      }),
    freeShipping: z.string().trim().optional(),
    deliveryTime: z.string().trim().optional(),
    shippingMethods: z.string().trim().optional(),
    isEnabled: z.string().trim().optional(),
  })
  .strict();
