import express from "express";
import { signUp, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(signUp);

router.route("/signin").post(loginUser);

export default router;
