import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;

  console.log("Cookies:", req.cookies);
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated (no cookie)",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id: ... }

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};