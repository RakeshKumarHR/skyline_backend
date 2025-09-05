const Movie = require("../models/Movies");

const addMovie = async (req, res) => {
  try {
    const { title, synopsis, cover, genres } = req.body;

    if (!title || !synopsis || !cover) {
      return res.status(400).json({ message: "All fields are required" });
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
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addMovie, getMovies };
