import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../features/user/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}

// Token authenticate
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: Role };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Not a valid user." });
  }
};

// Role control
export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "No permisson." });
      return;
    }
    next();
  };
};
