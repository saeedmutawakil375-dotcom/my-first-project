import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const resolveUserFromToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.id).select("-password");
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    req.user = await resolveUserFromToken(authHeader);

    if (!req.user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

const optionalProtect = async (req, _res, next) => {
  try {
    req.user = await resolveUserFromToken(req.headers.authorization);
  } catch (_error) {
    req.user = null;
  }

  next();
};

export { protect, optionalProtect };
