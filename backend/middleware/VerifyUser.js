// middleware/verifyUser.js
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Unauthorized: Token not provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // ✅ Attach userId to request object
    next(); // ✅ Go to next middleware or controller
  } catch (err) {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

module.exports = verifyUser; // ✅ Export the middleware
