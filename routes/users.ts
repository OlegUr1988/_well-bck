import { User } from "@prisma/client";
import express, { Request, Response } from "express";
import _ from "lodash";
import AuthRequest from "../entities/Auth";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../entities/RequestQuery";
import admin from "../middlewares/admin";
import auth from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { updateUserPasswordSchema, userSchema } from "../schemas";
import { generateAuthToken, getHashedPassword } from "../utils/auth";

const router = express.Router();

router.get(
  "/",
  [auth, admin],
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) => {
    const { page, pageSize, searchedName } = req.query;

    const where = {
      username: {
        contains: searchedName,
      },
    };

    const orderBy = { username: "asc" } as const;

    const count = (await prisma.user.findMany({ where })).length;

    const users =
      page && pageSize
        ? await prisma.user.findMany({
            where,
            orderBy,
            skip: (parseInt(page) - 1) * parseInt(pageSize),
            take: parseInt(pageSize),
          })
        : await prisma.user.findMany({
            orderBy,
            where,
          });

    res.send({
      count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      results: users,
    });
  }
);

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
