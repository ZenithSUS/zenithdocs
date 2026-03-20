import { z } from "zod";
import { email, objectId } from "../utils/zod.utils.js";

export const userParamsSchema = z.object({
  userId: objectId,
});

export const getUserByEmailSchema = z.object({
  email,
});

export const updateUserSchema = z.object({
  userId: objectId,
  data: z
    .object({
      email: email.optional(),
      password: z.string().min(8).optional(),
      role: z.enum(["user", "admin"]).optional(),
      plan: z.enum(["free", "premium"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});
