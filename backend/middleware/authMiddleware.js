const jwt = require("jsonwebtoken");
const Judge = require("../models/Judge");
const MainJudge = require("../models/MainJudge");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Determine user type based on token payload
    const { judge, mainJudge } = decoded;

    if (judge) {
      req.userType = "judge";
      req.userId = judge.id;
    } else if (mainJudge) {
      req.userType = "mainJudge";
      req.userId = mainJudge.id;
    } else {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    // Add user details to the request
    req.user = { id: req.userId, userType: req.userType };

    // Optional: Attach user data to the request if needed
    if (req.userType === "judge") {
      req.userDetails = await Judge.findById(req.userId).select("-password");
    } else if (req.userType === "mainJudge") {
      req.userDetails = await MainJudge.findById(req.userId).select(
        "-password"
      );
    }

    if (!req.userDetails) {
      return res.status(401).json({
        msg: `${
          req.userType.charAt(0).toUpperCase() + req.userType.slice(1)
        } not found`,
      });
    }

    next();
  } catch (err) {
    console.error("Authorization error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired" });
    }
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
