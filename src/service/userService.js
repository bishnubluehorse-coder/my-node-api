const fs = require("fs/promises");

const UserModel = require("../model/userModel");

const createUser = async (name, file) => {
    try {
        if (typeof name !== "string" || !name.trim()) {
            const error = new Error("Name is required");
            error.statusCode = 400;
            throw error;
        }

        return await UserModel.create({
            name: name.trim(),
            image: file ? `/uploads/users/${file.filename}` : null,
            originalImageName: file ? file.originalname : null,
        });
    } catch (error) {
        if (file?.path) {
            try {
                await fs.unlink(file.path);
            } catch (cleanupError) {
                if (cleanupError.code !== "ENOENT") {
                    console.error("Failed to remove uploaded image:", cleanupError);
                }
            }
        }

        throw error;
    }
};



const getUsers = async () => UserModel.findAll({ order: [["id", "DESC"]] });

const updateUser = async (id, name, file) => {
    try {
        validateName(name);
        const user = await findUser(id);
        const previousImage = user.image;

        await user.update({
            name: name.trim(),
            ...(file && {
                image: `/uploads/users/${file.filename}`,
                originalImageName: file.originalname,
            }),
        });

        if (file && previousImage !== user.image) {
            await removeStoredImage(previousImage);
        }

        return user;
    } catch (error) {
        if (file?.path) {
            try {
                await fs.unlink(file.path);
            } catch (cleanupError) {
                if (cleanupError.code !== "ENOENT") {
                    console.error("Failed to remove uploaded image:", cleanupError);
                }
            }
        }

        throw error;
    }
};

const deleteUser = async (id) => {
    const user = await findUser(id);
    const imagePath = user.image;

    await user.destroy();
    await removeStoredImage(imagePath);
};

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
};