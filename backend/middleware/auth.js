import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  // 1️⃣ Check header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
console.log("Authorization Header:", authHeader);
  /**
   * 2️⃣ DEV MODE BYPASS
   * Accept temporary frontend tokens like: token_12345
   */
  if (token.startsWith("demo_") || token.startsWith("token_")) {
    req.user = {
      userId: token,
      id: token,
      username: "admin_demo",
      role: "admin"
    };
    return next();
  }

  /**
   * 3️⃣ REAL JWT AUTH
   */
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
