import { z } from "zod";

const Name = z.string().trim().min(1, { message: "Username is Required." });

const email = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1, { message: "Email is Required" });

const phoneNumber = z.optional(
  z.string()
  .trim()
  .length(10, { message: "Phone number must be exactly 10 digits long." })
  .regex(/^[6-9]\d{9}$/, {
    message: "Phone number must be 10 digits and can be start with 6,7,8,9.",
  })
);

export const signupUser = z
  .object({
    firstName:z.optional(Name),
    lastName: z.optional(Name),
    email: email,
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message:
          "Password must include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
      }),
    role: z.optional(z.enum(["Customer", "Seller"])),
    phoneNumber: phoneNumber,
    isPhoneVerified: z.optional(z.boolean()),
  })
  .strict();

export const signinUser = z
  .object({
    email: email,
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long." }),
  })
  .strict();

export const userNameChange = z.object({
  firstName: z.optional(Name),
  lastName: z.optional(Name),
  phoneNumber : z.optional(phoneNumber)
});
export const resendEmail = z
  .object({
    email: email,
  })
  .strict();
