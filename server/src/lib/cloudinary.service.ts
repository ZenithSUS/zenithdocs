import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config/env.js";
import os from "os";
import path from "path";
import https from "https";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const baseFolder =
  config.nodeEnv === "production" ? "zenithdocs" : "zenithdocs-dev";

export const downloadFileFromCloudinary = (
  publicId: string,
  mimeType: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resource(
      publicId,
      { resource_type: "raw" },
      (error, result) => {
        if (error || !result) return reject(error);

        const ext = mimeType.split("/")[1] ?? "bin";
        const tempPath = path.join(
          os.tmpdir(),
          `reprocess=${Date.now()}.${ext}`,
        );
        const file = fs.createWriteStream(tempPath);

        https.get(result.secure_url, (response) => {
          response.pipe(file);
          file
            .on("finish", () => {
              file.close();
              resolve(tempPath);
            })
            .on("error", () => {
              fs.unlink(tempPath, () => {});
              reject(error);
            });
        });
      },
    );
  });
};

export const uploadToCloudinary = (
  filePath: string,
  originalName: string,
  userId: string,
): Promise<{ url: string; publicId: string }> => {
  const folder = `${baseFolder}/${userId}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        public_id: `${Date.now()}-${originalName}`,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    uploadStream.on("error", reject);

    const readStream = fs.createReadStream(filePath).pipe(uploadStream);

    readStream.on("error", (err) => {
      readStream.destroy();
      reject(err);
    });
  });
};

export const deleteFileFromCloudinary = (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "raw" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve();
      },
    );
  });
};

export default cloudinary;
