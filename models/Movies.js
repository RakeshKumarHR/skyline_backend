const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    synopsis: { type: String, required: true },
    cover: { type: String, required: true },
    genres: [{ type: String }],
    ratings: [{ type: Number, default: 0 }],
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
