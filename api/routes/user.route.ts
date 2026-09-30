import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  test,
  updateUserProfile,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.route("/test").get(test);

router
  .route("/update/:id")
  .put(isAuthenticatedUser, upload.single("avatar"), updateUserProfile);

router.route("/delete/:id").delete(isAuthenticatedUser, deleteUser);

router.get("/:id/listings", isAuthenticatedUser, getUserListings);

router.get("/:id", isAuthenticatedUser, getUser);

export default router;
