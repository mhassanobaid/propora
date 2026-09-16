import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  createListing,
  deleteListing,
  updateListing,
  showListing,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticatedUser, createListing);

router
  .route("/:id")
  .delete(isAuthenticatedUser, deleteListing)
  .put(isAuthenticatedUser, updateListing)
  .get(showListing);

export default router;
