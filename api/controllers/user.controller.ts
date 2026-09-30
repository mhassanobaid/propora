import type { Request, Response, NextFunction } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import type { ApiResponse } from "../types/api.types.js";

interface UpdateUserProfileBody {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export const test = async (req: Request, res: Response) => {
  return res.send("<h1>Hello World from Express!</h1>");
};

export const updateUserProfile = catchAsyncErrors(
  async (
    req: Request<{ id: string }, {}, UpdateUserProfileBody>,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.params.id != req.user!.id) {
      return next(new ErrorHandler("User can update only its prfofile", 401));
    }

    const newUserData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
    };

    // why again findById in action though we had quered mongodb for user fetching in middleware of auth but it might possible that our profile has stale data or non fresh data so to prevent it again fetch
    const user = await User.findById(req.user!.id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.username = newUserData.username ?? user.username;
    user.email = newUserData.email ?? user.email;
    user.avatar = newUserData.avatar ?? user.avatar;

    if (newUserData.password) {
      user.password = newUserData.password;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      user: user,
    });
  },
);

export const deleteUser = catchAsyncErrors(
  async (
    req: Request,
    res: Response<ApiResponse<never>>,
    next: NextFunction,
  ) => {
    if (req.user!.id !== req.params.id)
      return next(new ErrorHandler(`You can delete your own account`, 401));
    // we will remove cloudinary later
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User of id ${req.params.id} not found`, 404),
      );
    }

    res.clearCookie("token");
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: `User of ${req.params.id} deleted successfully`,
    });
  },
);

export const getUserListings = catchAsyncErrors(async (req, res, next) => {
  if (req.user!.id === req.params.id) {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json({
      success: true,
      listings_count: listings.length,
      listings: listings,
    });
  } else {
    return next(new ErrorHandler("You can only view your own listings!", 401));
  }
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorHandler("User not found!", 404));

  const { password: pass, ...rest } = user.toObject();

  res.status(200).json(rest);
});
