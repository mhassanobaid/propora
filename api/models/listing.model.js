import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Listing name is required"],
      trim: true,
      minlength: [3, "Listing name must be at least 3 characters"],
      maxlength: [100, "Listing name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Listing description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },

    regularPrice: {
      type: Number,
      required: [true, "Regular price is required"],
      min: [0, "Regular price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      required: [true, "Discount price is required"],
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.regularPrice;
        },
        message: "Discount price cannot be greater than regular price",
      },
    },

    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [0, "Bathrooms cannot be negative"],
    },

    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [0, "Bedrooms cannot be negative"],
    },

    furnished: {
      type: Boolean,
      required: [true, "Furnished status is required"],
    },

    parking: {
      type: Boolean,
      required: [true, "Parking status is required"],
    },

    type: {
      type: String,
      required: [true, "Listing type is required"],
      enum: {
        values: ["sale", "rent"],
        message: "Type must be either sale or rent",
      },
      lowercase: true,
      trim: true,
    },

    offer: {
      type: Boolean,
      required: [true, "Offer status is required"],
      default: false,
    },

    imageUrls: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: (urls) => urls.length > 0,
        message: "At least one image is required",
      },
    },

    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
