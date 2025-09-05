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

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

module.exports = app;
