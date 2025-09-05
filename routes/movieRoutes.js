const express = require("express");
const router = express.Router();
const { addMovie, getMovies } = require("../controllers/movieController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/", getMovies);
router.post("/", protect, admin, addMovie);
router.post("/rate", protect, addRating);

module.exports = router;
