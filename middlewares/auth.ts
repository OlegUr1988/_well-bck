import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import getKey from "../utils/getKey";

interface AuthRequest extends Request {
  user: JwtPayload | string;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");
  if (!token)
    res.status(401).send({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token!, getKey());
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid token." });
  }
};

export default auth;
