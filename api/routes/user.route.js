import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  test,
  updateUserProfile,
  deleteUser,
  getUserListings,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/test").get(test);

router.route("/update/:id").put(isAuthenticatedUser, updateUserProfile);

router.route("/delete/:id").delete(isAuthenticatedUser, deleteUser);

router.get("/:id/listings", isAuthenticatedUser, getUserListings);

export default router;
