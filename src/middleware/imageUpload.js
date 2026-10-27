const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const multer = require('multer');

const imageDirectory = path.resolve(__dirname, '../../uploads/users');
const imageTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        fs.mkdir(imageDirectory, { recursive: true }, (error) => {
            callback(error, imageDirectory);
        });
    },
    filename: (req, file, callback) => {
        const originalName = path.basename(file.originalname.replace(/\\/g, '/'));
        const originalStem = path.basename(originalName, path.extname(originalName));
        const safeStem = originalStem
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^[_\.]+|[_\.]+$/g, '')
            .slice(0, 80) || 'image';

        callback(null, `${safeStem}-${randomUUID()}${imageTypes[file.mimetype]}`);
    },
});

const uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!Object.hasOwn(imageTypes, file.mimetype)) {
            const error = new Error('Unsupported image type. Use JPEG, PNG, GIF, or WebP.');
            error.statusCode = 400;
            return callback(error);
        }

        callback(null, true);
    },
}).single('image');

const hasValidSignature = (buffer, mimeType) => {
    if (mimeType === 'image/jpeg') {
        return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }

    if (mimeType === 'image/png') {
        return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    }

    if (mimeType === 'image/gif') {
        return buffer.subarray(0, 6).toString('ascii').match(/^GIF8[79]a$/) !== null;
    }

    if (mimeType === 'image/webp') {
        return buffer.length >= 12
            && buffer.toString('ascii', 0, 4) === 'RIFF'
            && buffer.toString('ascii', 8, 12) === 'WEBP';
    }

    return false;
};

const validateImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const buffer = await fs.promises.readFile(req.file.path);
        if (!hasValidSignature(buffer, req.file.mimetype)) {
            const error = new Error('Uploaded file contents do not match a supported image type.');
            error.statusCode = 400;
            throw error;
        }

        return next();
    } catch (error) {
        try {
            await fs.promises.unlink(req.file.path);
        } catch (cleanupError) {
            console.error('Failed to remove invalid uploaded image:', cleanupError);
        }

        return next(error);
    }
};

module.exports = {
    imageDirectory,
    uploadImage,
    validateImage,
};
