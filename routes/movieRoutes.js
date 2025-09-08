const express = require("express");
const router = express.Router();
const {
  addMovie,
  getMovies,
  addRating,
  getGenres,
  getMovieById,
  deleteMovie,
  editMovie,
} = require("../controllers/movieController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/", getMovies);
router.post("/", protect, admin, addMovie);
router.put("/:id", protect, admin, editMovie);
router.post("/rate", protect, addRating);
router.get("/genres", getGenres);
router.get("/:id", getMovieById);
router.delete("/:id", protect, admin, deleteMovie);

module.exports = router;
