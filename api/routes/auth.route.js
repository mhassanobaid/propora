import express from "express";
import { signUp, loginUser, google } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(signUp);

router.route("/signin").post(loginUser);

router.route("/google").post(google);

export default router;
