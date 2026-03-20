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
