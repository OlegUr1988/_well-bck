import express, { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../entities/RequestQuery";
import { prisma } from "../prisma/client";
import { updateConstantSchema } from "../schemas";
import { Constant } from "@prisma/client";

const router = express.Router();

interface ConstantQuery extends RequestQuery {
  name: string;
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, ConstantQuery>,
    res: Response
  ) => {
    const { name } = req.query as ConstantQuery;

    if (name) {
      const constant = await prisma.constant.findUnique({
        where: { name },
      });
      if (!constant)
        return res
          .status(404)
          .send({ message: "The constant with given name was not found." });
      return res.send(constant);
    }

    const constants = await prisma.constant.findMany();

    res.send(constants);
  }
);

router.get("/:id", async (req, res) => {
  const constant = await prisma.constant.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!constant)
    return res
      .send(404)
      .send({ message: "The constant with the given ID was not found." });

  res.send(constant);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const constant = await prisma.constant.findUnique({
    where: { id },
  });
  if (!constant)
    return res
      .send(404)
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
