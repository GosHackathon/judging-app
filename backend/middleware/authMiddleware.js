const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Extract token from the Authorization header
  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded judge information to the request object
    req.judge = decoded.judge;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
