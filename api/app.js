import express from "express";
// const error = require("./middlewares/error");
import errorMiddleware from "./middlewares/error.js";

const app = express();

// will be used in sign up to have client data in json
app.use(express.json());

// routes import
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/", authRoutes);

app.use(errorMiddleware);

export default app;
