const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

// const createUser = catchAsync(async (req, res) => {
//   const user = await userService.createUser(req.body);
//   res.status(httpStatus.CREATED).send(user);
// });
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body, req.user); // ✅ pass user
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['fullName', 'role', 'refByEmail', 'createdBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const updateUserByEmail = catchAsync(async (req, res) => {
  const user = await userService.updateUserByEmail(req.query.email, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUserByEmail = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.params.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const deleteUserByEmail = catchAsync(async (req, res) => {
  const user = await userService.deleteUserByEmail(req.query.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});
/**
 * Get User Counts By Roles
 * Only Superadmin
 */
const getUserRoleCounts = catchAsync(async (req, res) => {
  const result = await userService.getUserRoleCounts();

  res.status(httpStatus.OK).send({
    status: true,
    message: 'User role counts fetched successfully',
    data: result,
  });
});

/**
 * Update Sales User Active Status
 */
const updateSalesUserStatus = catchAsync(
  async (req, res) => {
    const user = await userService.updateSalesUserStatus(
      req.params.userId,
      req.body.isActive
    );

    res.status(httpStatus.OK).send({
      success: true,
      message: req.body.isActive
        ? 'Sales user activated successfully'
        : 'Sales user deactivated successfully',
      data: user,
    });
  }
);
/**
 * Update User Active Status
 */
const updateUserStatus = catchAsync(
  async (req, res) => {
    const user = await userService.updateUserStatus(
      req.params.email,
      req.body.isActive
    );

    res.status(httpStatus.OK).send({
      success: true,
      message: req.body.isActive
        ? 'User activated successfully'
        : 'User deactivated successfully',
      data: user,
    });
  }
);

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserByEmail,
  deleteUser,
  getUserByEmail,
  deleteUserByEmail,
  getUserRoleCounts,
  updateSalesUserStatus,
  updateUserStatus,
};
