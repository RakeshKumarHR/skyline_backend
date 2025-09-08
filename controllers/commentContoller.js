const Comment = require("../models/Comment");

const getComments = async (req, res) => {
  try {
    const { movieId } = req.query;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required " });
    }
    const comments = await Comment.find({ movie: movieId })
      .populate("movie", "title")
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { user, movie, text } = req.body;
    const comment = new Comment({
      user,
      movie,
      text,
    });
    const savedComment = await comment.save();
    await savedComment.populate("user", "name");
    await savedComment.populate("movie", "title");
    res
      .status(201)
      .json({ message: "comment added successfully", data: savedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId, comment } = req.body;

    const userId = req.user._id;
    const updatedComment = await Comment.findByIdAndUpdate(
      { _id: commentId, user: userId },
      {
        $set: { text: comment },
      },
      { new: true, runValidators: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment Updated", data: updatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    let comment;
    if (isAdmin) {
      comment = await Comment.findByIdAndDelete(id);
    } else {
      comment = await Comment.findOneAndDelete({
        _id: id,
        user: userId,
      });
    }

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully", data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .select("-__v ")
      .populate("user", "name")
      .populate("movie", "title")
      .sort({ createdAt: -1 });

    if (!comments) {
      return res.status(404).json({ message: "Comments not found" });
    }
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { flag } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      { _id: id },
      { status: flag ? "visible" : "hidden" },
      { new: true, runValidators: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCommentsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = await Comment.find({
      movie: movieId,
      status: "visible",
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getAllComments,
  updateStatus,
  getCommentsByMovieId,
};
