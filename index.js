import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

app.use(express.json());
app.use("/api/user/", userRoutes);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error("Database connection error:", err));

export default app;
