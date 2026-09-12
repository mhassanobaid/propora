import express from "express";
// const error = require("./middlewares/error");

const app = express();

app.use(express.json());

// routes import
import userRoutes from "./routes/user.route.js";

app.use("/api/v1/users", userRoutes);

// app.use(error);

export default app;
