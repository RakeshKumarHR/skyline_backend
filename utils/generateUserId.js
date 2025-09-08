const jwt = require("jsonwebtoken");

const getUserIdByToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id;
  return userId;
};
module.exports = getUserIdByToken;
