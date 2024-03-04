import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getKey from "./getKey";

export const generateAuthToken = (user: User) =>
  jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
    },
    getKey(),
    { expiresIn: "1h" }
  );

export const getHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
