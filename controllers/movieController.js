const Movie = require("../models/Movies");
const Genre = require("../models/Genres");

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

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("genres", "title");
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addRating = async (req, res) => {
  try {
    const { movieId, rating } = req.body;

    if (!movieId || rating == null) {
      return res
        .status(400)
        .json({ message: "Movie ID and rating are required" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    movie.ratings.push(rating);
    movie.reviewsCount = movie.ratings.length;
    movie.averageRating =
      movie.ratings.reduce((acc, curr) => acc + curr, 0) / movie.ratings.length;

    await movie.save();

    res.json({ message: "Rating added", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addMovie, getMovies, addRating };
