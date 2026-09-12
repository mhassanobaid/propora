import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields like username, email and passowrrd must be provided",
    });
  }

  const user = new User({
    username,
    email,
    password,
  });

  // hash the password in model method (a good practice)
  try {
    await user.save();
    return res.status(201).json({
      success: true,
      message: `User created successfully ${user}`,
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: error.message,
    });
  }
};
