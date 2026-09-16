import Listing from "../models/listing.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const createListing = catchAsyncErrors(async (req, res, next) => {
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

export const deleteListing = catchAsyncErrors(async (req, res, next) => {
  const listingIdToDel = req.params.id;

  const listing = await Listing.findById(listingIdToDel);

  if (!listing) {
    return next(
      new ErrorHandler(`Listing of ${listingIdToDel} Not Found`, 404),
    );
  }

  if (!listing.userRef.equals(req.user.id)) {
    return next(
      new ErrorHandler("You can only delete your own listings!", 401),
    );
  }

  await listing.deleteOne();

  return res.status(200).json({
    success: true,
    message: `Listing of ${listingIdToDel} deleted SUCCESSFULLY`,
  });
});

export const updateListing = catchAsyncErrors(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorHandler(`Listing of ${req.params.id} Not Found`, 404));
  }

  if (req.user.id !== listing.userRef.toString()) {
    return next(
      new ErrorHandler("You can only update your own listings!", 401),
    );
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
  );

  return res.status(200).json({
    success: true,
    listing: updatedListing,
  });
});

export const showListing = catchAsyncErrors(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorHandler(`Listing of ${req.params.id} Not Found`, 404));
  }

  res.status(200).json({
    success: true,
    listing: listing,
  });
});

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
