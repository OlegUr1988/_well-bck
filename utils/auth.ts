import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getKey from "./getKey";

export const generateAuthToken = (user: User) =>
  jwt.sign(
    {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      joined_at: user.joined_at,
    },
    getKey(),
    { expiresIn: "2h" }
  );

export const getHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
