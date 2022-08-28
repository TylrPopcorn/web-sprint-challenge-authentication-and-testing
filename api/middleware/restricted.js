const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

  console.log(req.headers.authorization, "FSFFSGFSGF")
  const token = req.headers.authorization
  if (token) {
    console.log("Yes", token)
    try {
      const decoded = jwt.verify(token, process.env.SECRET || 'shhh');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json("token invalid");
    }
  } else {
    console.log("NO", token)
    return res.status(401).json("token required");
  }

  next()
};
