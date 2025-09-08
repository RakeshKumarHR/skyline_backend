const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    synopsis: { type: String, required: true },
    cover: { type: String, required: true },
    genres: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
    ],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comments", required: true },
    ],
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
