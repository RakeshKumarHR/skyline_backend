const express = require("express");
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getAllComments,
  updateStatus,
  getCommentsByMovieId,
} = require("../controllers/commentContoller");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/", getComments);
router.get("/all", getAllComments);
router.post("/", protect, addComment);
router.put("/", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.put("/status/:id", protect, admin, updateStatus);
router.get("/movie/:movieId", getCommentsByMovieId);
module.exports = router;
