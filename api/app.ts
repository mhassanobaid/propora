import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

import errorMiddleware from "./middlewares/error.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/", authRoutes);
app.use("/api/v1/listings", listingRoutes);

const clientDistPath = path.join(__dirname, "client", "dist");

console.log("Client path:", clientDistPath);
console.log(
  "Index exists:",
  fs.existsSync(path.join(clientDistPath, "index.html")),
);

app.use(express.static(clientDistPath));

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }

  res.sendFile(
    path.join(clientDistPath, "index.html"),
    (err) => {
      if (err) {
        next(err);
      }
    },
  );
});

app.use(errorMiddleware);

export default app;