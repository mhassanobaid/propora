import mongoose, { Schema } from "mongoose";
import type { IListing } from "../types/listing.types.js";

const listingSchema = new Schema<IListing>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },

    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },

    furnished: {
      type: Boolean,
      required: true,
    },

    parking: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },

    offer: {
      type: Boolean,
      required: true,
    },

    imageUrls: {
      type: [String],
      required: true,
      default: [],
    },

    imagePublicIds: {
      type: [String],
      required: true,
      default: [],
    },

    userRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Listing = mongoose.model<IListing>("Listing", listingSchema);

export default Listing;