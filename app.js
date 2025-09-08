const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const commentsRoutes = require("./routes/commentRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/profile", profileRoutes);

module.exports = app;
