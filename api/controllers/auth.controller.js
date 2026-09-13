import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";

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

// Login User
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Repetion work so handle it in util
  // const token = user.getJWTToken();

  // return res.status(200).json({
  //   success: true,
  //   token: token,
  // });

  sendToken(user, 200, res);
});
