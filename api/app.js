import express from "express";
// const error = require("./middlewares/error");
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const __dirname = path.resolve();

// will be used in sign up to have client data in json
app.use(express.json());
app.use(cookieParser());

// routes import
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/", authRoutes);
app.use("/api/v1/listings", listingRoutes);

const clientDistPath = path.join(__dirname, "client", "dist");

import fs from "fs";

console.log("Client path:", clientDistPath);

console.log(
  "Index exists:",
  fs.existsSync(path.join(clientDistPath, "index.html")),
);

app.use(express.static(clientDistPath));

// React fallback
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

app.use(errorMiddleware);

export default app;
