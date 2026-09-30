import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

import type { IUser } from "../types/user.types.js";

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  getJWTToken(): string;
}

export type UserDocument = mongoose.HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },

    password: {
      type: String,
      select: false,
      minlength: [8, "Password should be greater than 8 characters"],
    },

    avatar: {
      type: String,
      default: "",
    },

    avatarPublicId: {
      type: String,
      default: "",
    },

    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  if (!this.password) {
    return;
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  return bcryptjs.compare(password, this.password);
};

userSchema.methods.getJWTToken = function (): string {
  const expiresIn = process.env.JWT_EXPIRE;

  if (!expiresIn) {
    throw new Error("JWT_EXPIRE is not defined");
  }

  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    },
  );
};

const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
  "User",
  userSchema,
);

export default User;
