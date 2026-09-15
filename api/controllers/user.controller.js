import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";

export const test = async (req, res) => {
  return res.send("<h1>Hello World from Express!</h1>");
};

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  if (req.params.id != req.user.id) {
    return next(new ErrorHandler(401, "User can update only its profile"));
  }

  const newUserData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
  };

  // why again findById in action though we had quered mongodb for user fetching in middleware of auth but it might possible that our profile has stale data or non fresh data so to prevent it again fetch
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.username = newUserData.username ?? user.username;
  user.email = newUserData.email ?? user.email;
  user.avatar = newUserData.avatar ?? user.avatar;

  if (newUserData.password) {
    const isPasswordMatched = await user.comparePassword(newUserData.password);

    if (!isPasswordMatched) {
      user.password = newUserData.password;
    }
  }

  await user.save();

  return res.status(200).json({
    success: true,
    user: user,
  });
});
