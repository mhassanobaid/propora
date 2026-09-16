import Listing from "../models/listing.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const createListing = catchAsyncErrors(async (req, res, next) => {
  console.log("ASDAAAAAAAAASDDDDDDDDDDDDASDASDASDASD");

  const {
    name,
    description,
    address,
    regularPrice,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer,
    imageUrls,
  } = req.body;

  // Basic request validation
  if (
    !name ||
    !description ||
    !address ||
    regularPrice === undefined ||
    discountPrice === undefined ||
    bathrooms === undefined ||
    bedrooms === undefined ||
    furnished === undefined ||
    parking === undefined ||
    !type ||
    !Array.isArray(imageUrls) ||
    imageUrls.length === 0
  ) {
    return next(
      new ErrorHandler("Please provide all required listing fields", 400),
    );
  }

  const listing = await Listing.create({
    name,
    description,
    address,
    regularPrice,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer: offer ?? false,
    imageUrls,
    userRef: req.user.id,
  });

  return res.status(201).json({
    success: true,
    message: "Listing created successfully",
    listing,
  });
});
