import { z } from "zod";

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name is required")
      .max(40, "First name must have less then 40 characters"),
    last_name: z
      .string()
      .min(2, "Last name is required")
      .max(40, "Last name must have less then 40 characters"),
    email: z.string().email("Invalid email"),
    user_password: z.string().min(8, "Minimum 8 characters"),
    user_confirm_password: z.string().min(8),
  })
  .refine((data) => data.user_password === data.user_confirm_password, {
    message: "Passwords does not match",
    path: ["user_confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
