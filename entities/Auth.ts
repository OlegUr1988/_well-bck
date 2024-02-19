import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export default interface AuthRequest extends Request {
  user: JwtPayload | string;
}
