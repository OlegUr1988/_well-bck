import express from "express";
import { userSchema } from "../schemas";
import { User } from "@prisma/client";
import { prisma } from "../prisma/client";
import _ from "lodash";
import bcrypt from "bcrypt";
import getKey from "../utils/getKey";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  const validation = userSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { username, password, isAdmin } = req.body as User;

  const user = await prisma.user.findUnique({ where: { username } });
  if (user)
    return res.status(400).send({ message: "User already registered." });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashed,
      isAdmin,
    },
  });

  const token = jwt.sign({ id: newUser.id }, getKey());

  res
    .status(201)
    .header("x-auth-token", token)
    .send(_.pick(newUser, ["id", "username", "isAdmin", "joined_at"]));
});

export default router;
