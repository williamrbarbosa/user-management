import { z } from "zod";

export const userSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name is required")
    .max(40, "First name must have less then 40 characters"),
  last_name: z
    .string()
    .min(2, "Last name is required")
    .max(40, "Last name must have less then 40 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  status: z.string(),
});

export type UserFormData = z.infer<typeof userSchema>;
