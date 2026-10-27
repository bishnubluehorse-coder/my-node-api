const asyncHandler = require('../utils/asyncHandler');
const userService = require('../service/userService');

const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body.name, req.file);

    res.status(201).json({
        code: 201,
        message: "User created successfully",
        data: user,
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getUsers();

    res.status(200).json({
        code: 200,
        data: users,
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await userService.deleteUser(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: user
    });
});

module.exports = {
    createUser,
    getUsers,
    deleteUser
};