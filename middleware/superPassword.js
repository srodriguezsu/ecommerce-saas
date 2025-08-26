// Middleware to validate a 'x-super-password' header against env SUPER_PASSWORD
export function superPassword(req, res, next) {
  const superPassword = process.env.SUPER_PASSWORD;
  const headerPassword = req.headers["x-super-password"];
  if (!superPassword) {
    return res.status(500).json({ error: "SUPER_PASSWORD not configured" });
  }
  if (!headerPassword || headerPassword !== superPassword) {
    return res.status(403).json({ error: "Invalid or missing super password" });
  }
  next();
}
