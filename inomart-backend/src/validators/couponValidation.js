import { z } from "zod";

export const couponValidation = z
  .object({
    minAmount: z
      .number()
      .int("amount must be integer")
      .min(1, { message: "Minimum amount should be at least 1." }),

    validFromDateTime: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, { message: "Invalid from date/time format. Use MM-DD-YY HH:mm:ss." })
      .transform(dateStr => {
        const [date, time] = dateStr.split(' ');
        const [month, day, year] = date.split('-');
        const [hour, minute, second] = time.split(':');
        return new Date(`20${year}-${month}-${day}T${hour}:${minute}:${second}`);
      }),

    validTillDateTime: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, { message: "Invalid till date/time format. Use MM-DD-YY HH:mm:ss." })
      .transform(dateStr => {
        const [date, time] = dateStr.split(' ');
        const [month, day, year] = date.split('-');
        const [hour, minute, second] = time.split(':');
        return new Date(`20${year}-${month}-${day}T${hour}:${minute}:${second}`);
      }),

    offerDetails: z
      .string()
      .trim()
      .min(5, { message: "Offer details must contain at least 5 characters." }),

    offerType: z.enum(["percentage", "flat"], {
      message: "Offer type must be either 'percentage' or 'flat'.",
    }),

    code: z
      .string()
      .trim()
      .min(4, { message: "Code must contain at least 4 characters." })
      .regex(/^[A-Z][A-Z0-9]*$/, { message: "Coupon must start with a letter and only contain uppercase letters and numbers." }),

    amount: z.number().int("amount must be integer").min(1, { message: "Amount should be at least 1." }),

    isActive: z.boolean({
      message: "isActive is required and must be a boolean"
    }),
    isFirstTime: z.boolean({
      message: "isFirst Time is required and must be a boolean"
    }),

    customerLimit: z
      .number()
      .min(1, { message: "Customer limit should be at least 1." }),

    product: z
      .array(z.string().trim().min(1, { message: "Product ID is required." }))
      .min(1, { message: "At least one product is required." }),

    category: z
      .array(z.string().trim().min(1, { message: "Category ID is required." }))
      .min(1, { message: "At least one category is required." }),
  })
  .strict()
  .refine(data => {
    const fromDate = new Date(data.validFromDateTime);
    const tillDate = new Date(data.validTillDateTime);
    const now = new Date();

    return fromDate >= now && fromDate < tillDate;
  }, {
    message: "Valid from date/time must be today or later and before valid till date/time.",
    path: ["validFromDateTime"], 
  })
  .refine(data => {
    if (data.offerType === "flat") {
      return data.amount > 1; 
    } else if (data.offerType === "percentage") {
      return data.amount >= 1 && data.amount <= 100; 
    }
  }, {
    message: "Amount must be greater than 1 for flat offers or between 1 and 100 for percentage offers.",
    path: ["amount"],
  });