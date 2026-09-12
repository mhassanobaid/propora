import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const signUp = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(
      new ErrorHandler(
        "All fields of username, email and password must be provided",
        400,
      ),
    );
  }

  const user = new User({
    username,
    email,
    password,
  });

  // hash the password in model method (a good practice)
  await user.save();

  return res.status(201).json({
    success: true,
    message: `User created successfully ${user}`,
  });
});
