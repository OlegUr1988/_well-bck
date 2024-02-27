import jwt from "jsonwebtoken";
import getKey from "./getKey";
import { User } from "@prisma/client";

export const generateAuthToken = (user: User) =>
  jwt.sign(
    {
      id: user.id,
    },
    getKey(),
    { expiresIn: "1h" }
  );
