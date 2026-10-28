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

const updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body.name, req.file);

    res.status(200).json({
        code: 200,
        message: "User updated successfully",
        data: user,
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);

    res.status(200).json({
        code: 200,
        message: "User deleted successfully",
    });
});

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
};