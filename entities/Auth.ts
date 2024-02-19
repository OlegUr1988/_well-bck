import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { User } from "@prisma/client";

export default interface AuthRequest extends Request {
  user: User;
}
