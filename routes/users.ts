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
import {
  updateUserPasswordSchema,
  updateUserSchema,
  userSchema,
} from "../schemas";
import { generateAuthToken, getHashedPassword } from "../utils/auth";

const router = express.Router();

// Get list of users
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

    const select = {
      id: true,
      username: true,
      isAdmin: true,
    };

    const count = (await prisma.user.findMany({ where })).length;

    const users =
      page && pageSize
        ? await prisma.user.findMany({
            where,
            orderBy,
            select,
            skip: (parseInt(page) - 1) * parseInt(pageSize),
            take: parseInt(pageSize),
          })
        : await prisma.user.findMany({
            orderBy,
            where,
            select,
          });

    res.send({
      count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      results: users,
    });
  }
);

// Get users info
router.get("/me", auth, async (req, res) => {
  const { user } = req as AuthRequest;
  const me = await prisma.user.findUnique({
    where: { id: user.id },
  });

  res.send(_.pick(me, ["id", "username", "isAdmin", "joined_at"]));
});

// Register User
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

  const { password } = req.body as User;
  const hashed = await getHashedPassword(password);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      password: hashed,
    },
  });

  res.send(_.pick(updatedUser, ["id", "username", "isAdmin", "joined_at"]));
});

// Update User
router.put("/:id", [auth, admin], async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user)
    return res
      .status(404)
      .send({ message: "The user with the given ID was not found." });

  const validation = updateUserSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { username, isAdmin } = req.body as User;

  const sameUser = await prisma.user.findUnique({
    where: { username },
  });

  if (sameUser && sameUser.id !== id)
    return res
      .status(400)
      .send({ message: "The user with this tagname is already exists." });

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      username,
      isAdmin,
    },
  });

  res.send(updatedUser);
});

// Change users password (only for admin users)
router.put(
  "/set-password/:id",
  [auth, admin],
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user)
      return res
        .status(404)
        .send({ message: "The user with the given ID was not found." });

    const validation = updateUserPasswordSchema.safeParse(req.body);
    if (!validation.success)
      return res.status(400).send(validation.error.format());

    const { password } = req.body;
    const hashed = await getHashedPassword(password);

    await prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    res.send({ message: "Password was updated" });
  }
);

// Delete users
router.delete("/:id", [auth, admin], async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user)
    return res
      .status(404)
      .send({ message: "The user with the given ID was not found." });

  await prisma.user.delete({ where: { id } });

  res.send(user);
});

export default router;
