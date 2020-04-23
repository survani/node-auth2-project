const jwt = require("jsonwebtoken");
const { tokenSecret } = require("../config/secrets");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    jwt.verify(authorization, tokenSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).json("Invalid Credentials");
      } else {
        req.decodedToken = decodedToken;

        next();
      }
    });
  } else {
    res.status(400).json("No Credentials Provided");
  }
};
