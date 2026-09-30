import type { Response } from "express";

import type { UserDocument } from "../models/user.model.js";

const sendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response,
): void => {
  const token = user.getJWTToken();
  

  // options for cookie
  const cookieExpire = process.env.COOKIE_EXPIRE;

  if (!cookieExpire) {
    throw new Error("COOKIE_EXPIRE is not defined");
  }

  const options = {
    expires: new Date(
      Date.now() + Number(cookieExpire) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    authProvider: user.authProvider,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: userResponse,
    token,
  });
};

export default sendToken;