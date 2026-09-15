import express from "express";
import {
  signUp,
  loginUser,
  google,
  signOut,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(signUp);

router.route("/signin").post(loginUser);

router.route("/google").post(google);

router.route("/signout").get(signOut);

export default router;
