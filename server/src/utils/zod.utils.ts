import mongoose from "mongoose";
import z from "zod";

export const objectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid object ID",
  });
