import { User } from "@prisma/client";
import { Request } from "express";

export default interface AuthRequest extends Request {
  user: User;
}
