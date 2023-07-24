// const cloudinary = require('cloudinary');
const cloudinary = require('cloudinary');
// Configuration
cloudinary.config({
  cloud_name: 'djcsnpiy1',
  api_key: '929382464478723',
  api_secret: 'VQlWL_BL72ap20qF5xr2hdAFm5w',
});

// Upload
const cloudinaryUploadImage = async (fileToUploads, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader
      .upload(fileToUploads, (result) => {
        resolve(
          {
            url: result.url,
            id: result.public_id,
          },

          {
            resource_type: 'auto',
          }
        );
      })
      .then();
  });
};

module.exports = {
  cloudinaryUploadImage,
};
