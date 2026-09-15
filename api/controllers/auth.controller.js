import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";
import { firebaseAdminAuth } from "../config/firebaseAdmin.js";

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
    authProvider: "local",
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

export const google = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ErrorHandler("Firebase ID token is required", 401));
  }

  const idToken = authHeader.split("Bearer ")[1];
  console.log(idToken);

  // Verify Firebase ID token
  const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);

  const {
    uid,
    email,
    name,
    picture,
    email_verified: emailVerified,
  } = decodedToken;

  if (!email) {
    return next(new ErrorHandler("Google account email is required", 400));
  }

  if (!emailVerified) {
    return next(new ErrorHandler("Google email is not verified", 401));
  }

  // Find existing user by Firebase UID first
  let user = await User.findOne({
    firebaseUid: uid,
  });

  // If this Firebase account is not linked yet,
  // check whether the email already exists.
  if (!user) {
    user = await User.findOne({ email });
  }

  if (user) {
    // Link Firebase account if it wasn't linked before
    let shouldSave = false;

    if (!user.firebaseUid) {
      user.firebaseUid = uid;
      shouldSave = true;
    }

    if (picture && user.avatar !== picture) {
      user.avatar = picture;
      shouldSave = true;
    }

    if (shouldSave) {
      await user.save();
    }
  } else {
    // Create a new user
    user = await User.create({
      username: name || email.split("@")[0],
      email,
      firebaseUid: uid,
      avatar: picture || undefined,
      authProvider: "google",
    });
  }

  // Use your existing JWT system
  sendToken(user, 200, res);
});
