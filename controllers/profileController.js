const Comment = require("../models/Comment");
const Movie = require("../models/Movies");
const User = require("../models/User");
const getUserIdByToken = require("../utils/generateUserId");

const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const userId = getUserIdByToken(token);

    const user = await User.findById(userId).select("-password -__v");
    const comments = await Comment.find({ user: userId })
      .select("-__v -user")
      .populate("movie", "title")
      .lean()
      .sort({ createdAt: -1 });
    const formattedComments = comments.map((c) => ({
      _id: c._id,
      text: c.text,
      movie: c.movie?.title || null,
      createdAt: c.createdAt,
    }));

    const ratedMovies = await Movie.find({ "ratings.user": userId }).lean();
    const userRatings = ratedMovies?.map((movie) => {
      const ratedMovie = movie.ratings?.find(
        (ele) => String(ele.user) === userId
      );

      return {
        userRating: ratedMovie?.value,
        _id: movie._id,
        title: movie.title,
        createdAt: ratedMovie?.createdAt,
      };
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user, comments: formattedComments, ratings: userRatings });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { getProfile };
