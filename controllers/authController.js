const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (await user.matchPassword(password)) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  } else {
    return res
      .status(404)
      .json({ message: "User not found. Please provide name to register." });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: false,
    token: generateToken(user._id),
  });
};

module.exports = { loginUser, registerUser };
