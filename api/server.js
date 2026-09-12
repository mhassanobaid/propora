import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// config
// dotenv.config({path: "be/config/config.env"})

// if terminal is in be
dotenv.config();

const PORT = process.env.PORT || 5000;

// handle uncaught exception
// console.log(youtube);

// connect to db
connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
