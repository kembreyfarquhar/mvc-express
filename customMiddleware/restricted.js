const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "secret";

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.jwtToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Please provide a token" });
  }
};
