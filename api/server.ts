import "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";

process.on("uncaughtException", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

const PORT = Number(process.env.PORT) || 5000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
