import express, { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  ResponseBody,
} from "../entities/RequestQuery";
import { prisma } from "../prisma/client";
import { partParameterSchema, partSchema } from "../schemas";
import PartParameter from "../entities/PartParameter";

const router = express.Router();

interface PartParameterQuery {
  partId: string;
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, PartParameterQuery>,
    res: Response
  ) => {
    const { partId } = req.query;

    const where = partId
      ? {
          partId: parseInt(partId),
        }
      : {};

    const params = await prisma.partParameter.findMany({ where });

    res.send(params);
  }
);

router.get("/:id", async (req, res) => {
  const parameter = await prisma.partParameter.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { part: true },
  });
  if (!parameter)
    return res
      .status(404)
      .send({ message: "The parameter with the given ID was not found." });

  res.send(parameter);
});

router.post("/", async (req, res) => {
  const validation = partParameterSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, partId, parameterTypeId } = req.body as PartParameter;

  const part = await prisma.part.findUnique({
    where: { id: partId },
  });
  if (!part)
    return res
      .status(400)
      .send({ message: "Invalid equipments part was provided" });

  const newParameter = await prisma.partParameter.create({
    data: {
      name,
      partId,
      parameterTypeId,
    },
  });

  res.status(201).send(newParameter);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const parameter = await prisma.partParameter.findUnique({
    where: { id },
    include: { part: true },
  });
  if (!parameter)
    return res
      .status(404)
      .send({ message: "The parameter with the given ID was not found." });

  const validation = partParameterSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, partId, parameterTypeId } = req.body as PartParameter;

  const part = await prisma.part.findUnique({
    where: { id: partId },
  });
  if (!part)
    return res
      .status(400)
      .send({ message: "Invalid equipments part was provided" });

  const updatedParameter = await prisma.partParameter.update({
    where: { id },
    data: { name, partId, parameterTypeId },
  });

  res.send(updatedParameter);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const parameter = await prisma.partParameter.findUnique({
    where: { id },
  });
  if (!parameter)
    return res
      .status(404)
      .send({ message: "The parameter with the given ID was not found." });

  const deletedParameter = await prisma.partParameter.delete({ where: { id } });

  res.send(deletedParameter);
});

export default router;
