const Movie = require("../models/Movies");
const Genre = require("../models/Genres");
const Comment = require("../models/Comment");

const addMovie = async (req, res) => {
  try {
    const { title, synopsis, cover, genres } = req.body;

    if (!title || !synopsis || !cover || !genres || !genres.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findGenres = await Genre.find({ _id: { $in: genres } });
    if (findGenres.length !== genres.length) {
      return res.status(400).json({ message: "Invalid genre" });
    }

    const movie = new Movie({
      title,
      synopsis,
      cover,
      genres,
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const editMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, synopsis, cover, genres } = req.body;

    if (!title || !synopsis || !cover || !genres || !genres.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findGenres = await Genre.find({ _id: { $in: genres } });
    if (findGenres.length !== genres.length) {
      return res.status(400).json({ message: "Invalid genre" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, synopsis, cover, genres },
      { new: true }
    ).populate("genres", "title");

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("genres", "title");
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addRating = async (req, res) => {
  try {
    const { movieId, userId, rating } = req.body;

    if (!movieId || !userId || rating == null) {
      return res
        .status(400)
        .json({ message: "Movie ID, user ID, and rating are required" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const now = new Date();
    const existingRating = movie.ratings.findIndex(
      (r) => r.user.toString() === userId
    );

    if (existingRating >= 0) {
      movie.ratings[existingRating].value = rating;
      movie.ratings[existingRating].updatedAt = now;
    } else {
      movie.ratings.push({
        user: userId,
        value: rating,
        createdAt: now,
        updatedAt: now,
      });
    }

    movie.reviewsCount = movie.ratings.length;
    movie.averageRating =
      movie.ratings.reduce((acc, curr) => acc + curr.value, 0) /
      movie.ratings.length;

    await movie.save();

    res.json({ message: "Rating added/updated", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate(
      "genres",
      "title"
    );
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.status(500).json({ message: "Server error", err });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    await Comment.deleteMany({ movie: id });
    res.json({ message: "Movie deleted successfully", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addMovie,
  getMovies,
  addRating,
  getGenres,
  getMovieById,
  deleteMovie,
  editMovie,
};
