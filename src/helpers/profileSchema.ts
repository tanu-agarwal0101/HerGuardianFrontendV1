import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits (numbers only)"),
  location: z
    .string()
    .trim()
    .max(100, "Location must be under 100 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(250, "Bio must be under 250 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
