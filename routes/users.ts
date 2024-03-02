import { User } from "@prisma/client";
import express from "express";
import _ from "lodash";
import AuthRequest from "../entities/Auth";
import auth from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { updateUserPasswordSchema, userSchema } from "../schemas";
import { generateAuthToken, getHashedPassword } from "../utils/auth";

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

  const hashed = await getHashedPassword(password);

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

// Change User Password
router.put("/", auth, async (req, res) => {
  const { id } = (req as AuthRequest).user;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user)
    return res.send({ message: "The user with the given ID was not found." });

  const validation = updateUserPasswordSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { password } = req.body;
  const hashed = await getHashedPassword(password);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      password: hashed,
    },
  });

  res.send(_.pick(updatedUser, ["id", "username", "isAdmin", "joined_at"]));
});

export default router;
