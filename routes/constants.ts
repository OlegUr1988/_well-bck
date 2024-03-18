import { Constant } from "@prisma/client";
import express, { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../entities/RequestQuery";
import { prisma } from "../prisma/client";
import { updateConstantSchema } from "../schemas";

const router = express.Router();

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) => {
    const { page, pageSize, searchedName } = req.query;

    const where = {
      name: {
        contains: searchedName,
      },
    };

    const orderBy = { name: "asc" } as const;

    const count = (await prisma.constant.findMany({ where })).length;

    const constants =
      page && pageSize
        ? await prisma.constant.findMany({
            where,
            orderBy,
            skip: (parseInt(page) - 1) * parseInt(pageSize),
            take: parseInt(pageSize),
          })
        : await prisma.constant.findMany({
            orderBy,
            where,
          });

    res.send({
      count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      results: constants,
    });
  }
);

router.get("/:name", async (req, res) => {
  const constant = await prisma.constant.findUnique({
    where: { name: req.params.name },
  });
  if (!constant)
    return res
      .status(404)
      .send({ message: "The constant with the given name was not found." });

  res.send(constant);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const constant = await prisma.constant.findUnique({
    where: { id },
  });
  if (!constant)
    return res
      .status(404)
      .send({ message: "The constant with the given ID was not found." });

  const validation = updateConstantSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { value } = req.body as Constant;

  const updatedConstant = await prisma.constant.update({
    where: { id },
    data: {
      value,
    },
  });

  return res.send(updatedConstant);
});

export default router;
