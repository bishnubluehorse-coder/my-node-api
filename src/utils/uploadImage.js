const multer = require("multer");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: MAX_IMAGE_SIZE,
        files: 1,
    },

    fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(
                new Error("Only JPEG, PNG, and WebP images are allowed")
            );
        }

        callback(null, true);
    },
});

module.exports = upload;