const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};
