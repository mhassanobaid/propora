import express from "express";
// const error = require("./middlewares/error");

const app = express();

// will be used in sign up to have client data in json
app.use(express.json());

// routes import
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/", authRoutes);

// app.use(error);

export default app;
