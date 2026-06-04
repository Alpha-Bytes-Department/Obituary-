const cloudinary = require("cloudinary").v2;

cloudinary.config(process.env.CLOUDINARY_URL || "");

/**
 * Upload a buffer to Cloudinary.
 *
 * @param {Buffer} buffer
 * @param {object} options
 * @param {string} options.folder
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "obituary/profile-photos",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

module.exports = {
  cloudinary,
  uploadBuffer,
};
