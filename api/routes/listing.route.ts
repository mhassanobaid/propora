import express from "express";

import { isAuthenticatedUser } from "../middlewares/auth.js";

import upload from "../middlewares/upload.js";

import {
  createListing,
  deleteListing,
  updateListing,
  showListing,
  getListings,
} from "../controllers/listing.controller.js";

const router = express.Router();

// Specific routes first
router
  .route("/create")
  .post(isAuthenticatedUser, upload.array("images", 6), createListing);

router.route("/index").get(getListings);

// Dynamic route last
router
  .route("/:id")
  .delete(isAuthenticatedUser, deleteListing)
  .put(isAuthenticatedUser, upload.array("images", 6), updateListing)
  .get(showListing);

export default router;
