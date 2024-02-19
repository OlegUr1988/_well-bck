import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";
import { prisma } from "../prisma/client";
import { userSchema } from "../schemas";

const router = express.Router();

router.post("/", async (req, res) => {
  const validation = userSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { username, password, isAdmin } = req.body as User;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user)
    return res.status(400).send({ message: "Invalid email or password." });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send({ message: "Invalid email or password." });

  res.send(true);
});

export default router;
