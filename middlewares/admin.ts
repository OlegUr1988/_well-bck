import { NextFunction, Request, Response } from "express";
import AuthRequest from "../entities/Auth";

const admin = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req as AuthRequest;

  if (!user.isAdmin) return res.status(403).send("Access denied.");

  next();
};

export default admin;
