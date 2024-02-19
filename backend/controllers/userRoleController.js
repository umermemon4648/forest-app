// controllers/userRoleController.js
const Role = require('../models/roleModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');

// Get all roles
exports.getAllRoles = catchAsyncErrors(async (req, res, next) => {
  const roles = await Role.find();

  res.status(200).json({
    success: true,
    roles,
  });
});

// Create a new role
exports.createRole = catchAsyncErrors(async (req, res, next) => {
  const { name, permissions } = req.body;

  const role = await Role.create({
    name,
    permissions,
  });

  res.status(201).json({
    success: true,
    role,
  });
});

// Update a role
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  const { name, permissions } = req.body;

  const role = await Role.findByIdAndUpdate(
    req.params.id,
    { name, permissions },
    { new: true, runValidators: true }
  );

  if (!role) {
    return next(
      new ErrorHandler(`Role not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    role,
  });
});

// Delete a role
exports.deleteRole = catchAsyncErrors(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(
      new ErrorHandler(`Role not found with id: ${req.params.id}`, 404)
    );
  }

  // Check if any user has this role
  const usersWithRole = await User.find({ role: req.params.id });

  if (usersWithRole.length > 0) {
    return next(
      new ErrorHandler(
        'Cannot delete a role that is assigned to one or more users.',
        400
      )
    );
  }

  await role.remove();

  res.status(200).json({
    success: true,
    message: 'Role deleted successfully',
  });
});
