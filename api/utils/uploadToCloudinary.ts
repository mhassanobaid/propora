import type { UploadApiResponse } from "cloudinary";

import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "propora/listings",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Cloudinary upload returned no result"));
        }
      },
    );

    stream.end(buffer);
  });
};

export default uploadToCloudinary;
