import * as z from "zod";
export const contactSchema = z.object({
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        phoneNumber: z.string().min(1, "Phone is required"),
        email: z.string().email("Invalid email"),
        relationship: z.string().min(1, "Relationship is required"),
      })
    )
    .min(1, { message: "At least one contact is required" }),
});

export const singleContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  relationship: z.string().min(1, "Relationship is required"),
});

export const addressSchema = z.object({
  type: z.string().min(1, "Type is required"),
  latitude: z.number({ invalid_type_error: "Latitude must be a number" })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z.number({ invalid_type_error: "Longitude must be a number" })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  radiusMeters: z.number({ invalid_type_error: "Radius must be a number" })
    .positive("Radius must be a positive number")
    .optional()
    .nullable(),
  street: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

