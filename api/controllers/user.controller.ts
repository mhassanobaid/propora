import type { Request, Response, NextFunction } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import type { ApiResponse } from "../types/api.types.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

interface UpdateUserProfileBody {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  avatarPublicId?: string;
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
    if (req.params.id !== req.user!.id) {
      return next(new ErrorHandler("User can update only its profile", 401));
    }

    const user = await User.findById(req.user!.id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Keep the old image information before changing anything
    const oldAvatarPublicId = user.avatarPublicId;

    // Update normal profile fields
    user.username = req.body.username ?? user.username;
    user.email = req.body.email ?? user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    let newAvatarPublicId: string | undefined;

    try {
      // If user selected a new avatar
      if (req.file) {
        const uploadedImage = await uploadToCloudinary(req.file.buffer);

        user.avatar = uploadedImage.secure_url;
        user.avatarPublicId = uploadedImage.public_id;

        newAvatarPublicId = uploadedImage.public_id;
      }

      await user.save();

      // Delete OLD Cloudinary image only after DB update succeeds
      if (req.file && oldAvatarPublicId) {
        await cloudinary.uploader.destroy(oldAvatarPublicId);
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      // If new image was uploaded but DB update failed,
      // remove the new image to avoid an orphaned Cloudinary file.
      if (newAvatarPublicId) {
        await cloudinary.uploader.destroy(newAvatarPublicId);
      }

      return next(error);
    }
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
