import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { test, updateUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/test").get(test);

router.route("/update/:id").put(isAuthenticatedUser, updateUserProfile);

export default router;
