import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AuthRequest from "../entities/Auth";
import getKey from "../utils/getKey";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");
  if (!token)
    res.status(401).send({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token!, getKey());
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid token." });
  }
};

export default auth;
