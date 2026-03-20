import mongoose from "mongoose";
import z from "zod";

export const objectId = z
  .string()
  .min(1, "Object ID is required.")
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid object ID",
  });

export const email = z
  .string()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format.");

export const userTokenSchema = z.object({
  userId: objectId,
  role: z.enum(["user", "admin"]),
});

export const yearMonth = z
  .string()
  .min(1, "Month is required.")
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Invalid month format. Expected YYYY-MM.");

export const paginationFields = {
  page: z.number().min(1, "Page must be a positive integer").default(1),
  limit: z
    .number()
    .min(1, "Limit must be a positive integer")
    .max(100, "Limit cannot exceed 100")
    .default(10),
};
