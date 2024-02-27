import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";
import _ from "lodash";
import AuthRequest from "../entities/Auth";
import auth from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { userSchema } from "../schemas";
import { generateAuthToken } from "../utils/auth";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const { user } = req as AuthRequest;
  const me = await prisma.user.findUnique({
    where: { id: user.id },
  });

  res.send(_.pick(me, ["id", "username", "isAdmin", "joined_at"]));
});

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

  const token = generateAuthToken(newUser);

  res
    .status(201)
    .header("x-auth-token", token)
    .send(_.pick(newUser, ["id", "username", "isAdmin", "joined_at"]));
});

export default router;
