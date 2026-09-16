import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { createListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticatedUser, createListing);

export default router;
