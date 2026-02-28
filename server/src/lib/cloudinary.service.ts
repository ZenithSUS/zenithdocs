import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import config from "../config/env.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const baseFolder =
  config.nodeEnv === "production" ? "zenithdocs" : "zenithdocs-dev";

export const uploadToCloudinary = (
  buffer: Buffer,
  originalName: string,
  userId: string,
): Promise<{ url: string; publicId: string }> => {
  const folder = `${baseFolder}/${userId}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "raw",
        public_id: `${Date.now()}-${originalName}`,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error || !result) return reject(error);
      resolve();
    });
  });
};

export default cloudinary;
