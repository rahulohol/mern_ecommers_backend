const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

module.exports = {
  cloudinary, // Export the cloudinary object
  // Other exports if any
};
