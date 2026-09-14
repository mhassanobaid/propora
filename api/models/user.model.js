import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema(
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
      minLength: [8, "Password should be greater than 8 characters"],
    },

    avatar: {
      type: String,
      default: "",
    },

    firebaseUid: {
      type: String,
      unique: true,
      // to ensure that unique works propeley on optional firebaseUid
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

userSchema.pre("validate", function () {
  if (this.authProvider === "local" && !this.password) {
    this.invalidate("password", "Password is required for local accounts");
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    },
  );
};

const User = mongoose.model("User", userSchema);

export default User;
