import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

const app = express();

dotenv.config();

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT} !`);
});
