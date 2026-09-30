import mongoose from "mongoose";
import "../config/env.js";
import connectDB from "../config/db.js";

import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
connectDB();

const seedListings = async () => {
  try {
    // Get an existing user
    const user = await User.findOne();

    if (!user) {
      throw new Error("No user found. Create a user first.");
    }

    const listings = [
      {
        name: "Modern Family House",
        description:
          "A beautiful modern family house with spacious rooms and excellent facilities.",
        address: "DHA Phase 6, Lahore, Pakistan",
        regularPrice: 25000000,
        discountPrice: 23000000,
        bathrooms: 3,
        bedrooms: 4,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Cozy Apartment",
        description:
          "A comfortable apartment located near shopping centers and public transport.",
        address: "Gulberg, Lahore, Pakistan",
        regularPrice: 85000,
        bathrooms: 2,
        bedrooms: 2,
        furnished: true,
        parking: true,
        type: "rent",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Luxury Villa",
        description:
          "A spacious luxury villa featuring modern interiors and a large private garden.",
        address: "Bahria Town, Lahore, Pakistan",
        regularPrice: 45000000,
        discountPrice: 42000000,
        bathrooms: 5,
        bedrooms: 6,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Budget Apartment",
        description:
          "An affordable apartment suitable for a small family or working professionals.",
        address: "Johar Town, Lahore, Pakistan",
        regularPrice: 45000,
        bathrooms: 1,
        bedrooms: 2,
        furnished: false,
        parking: false,
        type: "rent",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Elegant Townhouse",
        description:
          "A well-maintained townhouse in a peaceful residential neighborhood.",
        address: "Model Town, Lahore, Pakistan",
        regularPrice: 18000000,
        bathrooms: 3,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Premium DHA House",
        description:
          "A premium house with stylish architecture, spacious bedrooms and modern amenities.",
        address: "DHA Phase 5, Lahore, Pakistan",
        regularPrice: 32000000,
        discountPrice: 30000000,
        bathrooms: 4,
        bedrooms: 5,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Small Studio Apartment",
        description:
          "A compact studio apartment ideal for students and young professionals.",
        address: "Gulberg III, Lahore, Pakistan",
        regularPrice: 35000,
        bathrooms: 1,
        bedrooms: 1,
        furnished: true,
        parking: false,
        type: "rent",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Spacious Bahria Villa",
        description:
          "A spacious villa with a beautiful lawn, multiple bedrooms and secure parking.",
        address: "Bahria Town, Lahore, Pakistan",
        regularPrice: 38000000,
        bathrooms: 4,
        bedrooms: 5,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Johar Town Flat",
        description:
          "A modern flat close to universities, markets and restaurants.",
        address: "Johar Town, Lahore, Pakistan",
        regularPrice: 55000,
        discountPrice: 50000,
        bathrooms: 2,
        bedrooms: 2,
        furnished: true,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Garden Town House",
        description:
          "A peaceful family house with large rooms and convenient access to major roads.",
        address: "Garden Town, Lahore, Pakistan",
        regularPrice: 21000000,
        bathrooms: 3,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Furnished Gulberg Apartment",
        description:
          "A fully furnished apartment located in the heart of Gulberg with modern facilities.",
        address: "Gulberg II, Lahore, Pakistan",
        regularPrice: 95000,
        discountPrice: 85000,
        bathrooms: 2,
        bedrooms: 2,
        furnished: true,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Valencia Family Home",
        description:
          "A comfortable family home in a peaceful residential area with excellent security.",
        address: "Valencia Town, Lahore, Pakistan",
        regularPrice: 16500000,
        bathrooms: 3,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Affordable Faisal Town Flat",
        description:
          "An affordable two-bedroom apartment suitable for a small family.",
        address: "Faisal Town, Lahore, Pakistan",
        regularPrice: 48000,
        bathrooms: 1,
        bedrooms: 2,
        furnished: false,
        parking: false,
        type: "rent",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "DHA Luxury Residence",
        description:
          "A luxurious residence with premium construction, spacious rooms and modern interiors.",
        address: "DHA Phase 8, Lahore, Pakistan",
        regularPrice: 55000000,
        discountPrice: 51000000,
        bathrooms: 5,
        bedrooms: 6,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Wapda Town Apartment",
        description:
          "A clean and comfortable apartment located in a family-friendly neighborhood.",
        address: "Wapda Town, Lahore, Pakistan",
        regularPrice: 60000,
        bathrooms: 2,
        bedrooms: 3,
        furnished: true,
        parking: true,
        type: "rent",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Model Town Luxury House",
        description:
          "A classic luxury house with spacious living areas and a beautiful garden.",
        address: "Model Town, Lahore, Pakistan",
        regularPrice: 42000000,
        bathrooms: 4,
        bedrooms: 5,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Bahria Rental Apartment",
        description:
          "A modern apartment with excellent security and nearby commercial facilities.",
        address: "Bahria Town, Lahore, Pakistan",
        regularPrice: 70000,
        discountPrice: 65000,
        bathrooms: 2,
        bedrooms: 2,
        furnished: true,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Canal View House",
        description:
          "A beautiful residential house offering spacious rooms and a peaceful environment.",
        address: "Canal Road, Lahore, Pakistan",
        regularPrice: 28000000,
        bathrooms: 3,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Executive Gulberg Apartment",
        description:
          "A premium furnished apartment designed for professionals and small families.",
        address: "Gulberg III, Lahore, Pakistan",
        regularPrice: 110000,
        bathrooms: 2,
        bedrooms: 2,
        furnished: true,
        parking: true,
        type: "rent",
        offer: false,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },

      {
        name: "Large Family Villa",
        description:
          "A large family villa with multiple bedrooms, spacious living areas and private parking.",
        address: "DHA Phase 7, Lahore, Pakistan",
        regularPrice: 48000000,
        discountPrice: 45000000,
        bathrooms: 5,
        bedrooms: 6,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: ["https://placehold.co/600x400"],
        userRef: user._id,
      },
    ];

    await Listing.deleteMany({});

    await Listing.insertMany(listings);

    console.log(`${listings.length} listings seeded successfully`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedListings();
