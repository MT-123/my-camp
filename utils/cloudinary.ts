const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {// upload paramters
        folder: 'MyCamp',// the foldername at cloudinay
        allowed_formats: ['jpg', 'jpeg', 'png']
    },
});

module.exports = {
    cloudinary,
    storage,
};
export {};
