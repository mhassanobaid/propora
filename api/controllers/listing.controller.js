import Listing from "../models/listing.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

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
  } = req.body;

  // 1. Validate image files
  if (!req.files || req.files.length === 0) {
    return next(new ErrorHandler("Please upload at least one image", 400));
  }

  // 2. Parse boolean values received through FormData
  const isOffer = offer === true || offer === "true";
  const isFurnished = furnished === true || furnished === "true";
  const hasParking = parking === true || parking === "true";

  // 3. Basic required-field validation
  if (
    !name?.trim() ||
    !description?.trim() ||
    !address?.trim() ||
    regularPrice === undefined ||
    bathrooms === undefined ||
    bedrooms === undefined ||
    !type
  ) {
    return next(
      new ErrorHandler("Please provide all required listing fields", 400),
    );
  }

  // 4. Validate discount price only when offer is enabled
  if (isOffer && discountPrice === undefined) {
    return next(
      new ErrorHandler("Discount price is required when offer is enabled", 400),
    );
  }

  if (isOffer && Number(discountPrice) > Number(regularPrice)) {
    return next(
      new ErrorHandler(
        "Discount price cannot be greater than regular price",
        400,
      ),
    );
  }

  let uploadedImages = [];

  try {
    // 5. Upload all images to Cloudinary
    uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer)),
    );

    const imageUrls = uploadedImages.map((image) => image.secure_url);

    const imagePublicIds = uploadedImages.map((image) => image.public_id);

    // 6. Create listing in MongoDB
    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice: Number(regularPrice),
      discountPrice: isOffer ? Number(discountPrice) : undefined,
      bathrooms: Number(bathrooms),
      bedrooms: Number(bedrooms),
      furnished: isFurnished,
      parking: hasParking,
      type,
      offer: isOffer,
      imageUrls,
      imagePublicIds,
      userRef: req.user.id,
    });

    // 7. Send successful response
    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    // 8. Cleanup Cloudinary images if listing creation fails
    if (uploadedImages.length > 0) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          cloudinary.uploader.destroy(image.public_id),
        ),
      );
    }

    return next(error);
  }
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

  // 1. Check listing exists
  if (!listing) {
    return next(new ErrorHandler(`Listing of ${req.params.id} Not Found`, 404));
  }

  // 2. Check ownership
  if (req.user.id !== listing.userRef.toString()) {
    return next(
      new ErrorHandler("You can only update your own listings!", 401),
    );
  }

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
  } = req.body;

  // 3. Parse FormData boolean values
  const isOffer = offer === true || offer === "true";
  const isFurnished = furnished === true || furnished === "true";
  const hasParking = parking === true || parking === "true";

  // 4. Validate required fields
  if (
    !name?.trim() ||
    !description?.trim() ||
    !address?.trim() ||
    regularPrice === undefined ||
    bathrooms === undefined ||
    bedrooms === undefined ||
    !type
  ) {
    return next(
      new ErrorHandler("Please provide all required listing fields", 400),
    );
  }

  // 5. Validate discount price
  if (isOffer && discountPrice === undefined) {
    return next(
      new ErrorHandler("Discount price is required when offer is enabled", 400),
    );
  }

  if (isOffer && Number(discountPrice) > Number(regularPrice)) {
    return next(
      new ErrorHandler(
        "Discount price cannot be greater than regular price",
        400,
      ),
    );
  }

  // 6. Parse existing images
  let existingImages;

  try {
    existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];
  } catch {
    return next(new ErrorHandler("Invalid existing images data", 400));
  }

  const newFiles = req.files || [];

  console.log("existingImages", existingImages);
  console.log("newFiles", newFiles);

  // 7. Validate image count
  if (existingImages.length + newFiles.length === 0) {
    return next(new ErrorHandler("You must have at least one image", 400));
  }

  if (existingImages.length + newFiles.length > 6) {
    return next(
      new ErrorHandler("You can only have 6 images per listing", 400),
    );
  }

  // 8. Validate new image size
  const hasLargeFile = newFiles.some((file) => file.size > 2 * 1024 * 1024);

  if (hasLargeFile) {
    return next(new ErrorHandler("Each image must be smaller than 2 MB", 400));
  }

  // Save ORIGINAL Cloudinary IDs before changing listing
  const oldImagePublicIds = [...(listing.imagePublicIds || [])];

  console.log("oldImagePublicIds", oldImagePublicIds);

  let uploadedImages = [];

  try {
    // 9. Upload new images
    if (newFiles.length > 0) {
      uploadedImages = await Promise.all(
        newFiles.map((file) => uploadToCloudinary(file.buffer)),
      );
    }

    console.log("uploadedImages", uploadedImages);

    // 10. New Cloudinary image data
    const newImageUrls = uploadedImages.map((image) => image.secure_url);

    console.log("newImageUrls", newImageUrls);

    const newImagePublicIds = uploadedImages.map((image) => image.public_id);

    console.log("newImagePublicIds", newImagePublicIds);

    // 11. Existing images that user kept
    const existingImageUrls = existingImages.map((image) => image.url);

    console.log("existingImageUrls", existingImageUrls);

    const existingImagePublicIds = existingImages.map(
      (image) => image.publicId,
    );

    console.log("existingImagePublicIds", existingImagePublicIds);

    // 12. Update listing fields
    listing.name = name;
    listing.description = description;
    listing.address = address;
    listing.regularPrice = Number(regularPrice);
    listing.discountPrice = isOffer ? Number(discountPrice) : undefined;
    listing.bathrooms = Number(bathrooms);
    listing.bedrooms = Number(bedrooms);
    listing.furnished = isFurnished;
    listing.parking = hasParking;
    listing.type = type;
    listing.offer = isOffer;

    // Existing kept images first,
    // new images afterwards
    listing.imageUrls = [...existingImageUrls, ...newImageUrls];

    listing.imagePublicIds = [...existingImagePublicIds, ...newImagePublicIds];

    // 13. Save MongoDB
    const updatedListing = await listing.save();

    // 14. Determine which OLD Cloudinary images were deleted
    console.log("oldImagePublicIds", oldImagePublicIds);
    console.log("existingImagePublicIds", existingImagePublicIds);

    const removedPublicIds = oldImagePublicIds.filter(
      (publicId) => !existingImagePublicIds.includes(publicId),
    );

    console.log("removedPublicIds", removedPublicIds);

    // 15. Delete removed old images from Cloudinary
    if (removedPublicIds.length > 0) {
      await Promise.allSettled(
        removedPublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId),
        ),
      );
    }

    // 16. Success
    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    // Cleanup newly uploaded images if update fails
    if (uploadedImages.length > 0) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          cloudinary.uploader.destroy(image.public_id),
        ),
      );
    }

    return next(error);
  }
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
