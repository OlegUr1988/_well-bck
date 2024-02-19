import express from "express";
import { userSchema } from "../schemas";
import { User } from "@prisma/client";
import { prisma } from "../prisma/client";
import _ from "lodash";

const router = express.Router();

router.post("/", async (req, res) => {
  const validation = userSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { username, password, isAdmin } = req.body as User;

  const user = await prisma.user.findUnique({ where: { username } });
  if (user)
    return res.status(400).send({ message: "User already registered." });

  const newUser = await prisma.user.create({
    data: {
      username,
      password,
      isAdmin,
    },
  });

  res
    .status(201)
    .send(_.pick(newUser, ["id", "username", "isAdmin", "joined_at"]));
});

export default router;
