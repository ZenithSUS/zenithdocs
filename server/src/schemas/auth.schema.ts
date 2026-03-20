import z from "zod";
import { email, objectId } from "../utils/zod.utils.js";

export const authSchema = z.object({
  email: email.min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});

export const authUserIdSchema = z.object({
  userId: objectId,
});
