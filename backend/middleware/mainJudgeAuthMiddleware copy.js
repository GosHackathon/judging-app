const jwt = require("jsonwebtoken");
const MainJudge = require("../models/MainJudge");

module.exports = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token payload includes the mainJudge key
    if (decoded.mainJudge) {
      req.userType = "mainJudge";
      req.userId = decoded.mainJudge.id;

      // Attach the main judge to the request
      req.mainJudge = await MainJudge.findById(req.userId).select("-password");
      if (!req.mainJudge) {
        return res.status(401).json({ msg: "Main Judge not found" });
      }
    } else {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    next();
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
