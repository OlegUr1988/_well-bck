import express, { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  ResponseBody,
} from "../entities/RequestQuery";
import { prisma } from "../prisma/client";
import { partSchema } from "../schemas";
import Part from "../entities/Part";

const router = express.Router();

interface PartQuery {
  equipmentId: string;
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, PartQuery>,
    res: Response
  ) => {
    const { equipmentId } = req.query;

    const where = equipmentId
      ? {
          equipmentId: parseInt(equipmentId),
        }
      : {};

    const parts = await prisma.part.findMany({ where });

    res.send(parts);
  }
);

router.get("/:id", async (req, res) => {
  const part = await prisma.part.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { equipment: true },
  });
  if (!part)
    return res
      .status(404)
      .send({ message: "The equipment part with the given ID was not found." });

  res.send(part);
});

router.post("/", async (req, res) => {
  const validation = partSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, equipmentId } = req.body as Part;

  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
  });
  if (!equipment)
    return res.status(400).send({ message: "Invalid equipment was provided" });

  const newPart = await prisma.part.create({
    data: {
      name,
      equipmentId,
    },
  });

  res.status(201).send(newPart);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const part = await prisma.part.findUnique({
    where: { id },
    include: { equipment: true },
  });
  if (!part)
    return res
      .status(404)
      .send({ message: "The equipment part with the given ID was not found." });

  const validation = partSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, equipmentId } = req.body as Part;

  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
  });
  if (!equipment)
    return res.status(400).send({ message: "Invalid equipment was provided" });

  const updatedPart = await prisma.part.update({
    where: { id },
    data: { name, equipmentId },
  });

  res.send(updatedPart);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const part = await prisma.part.findUnique({
    where: { id },
  });
  if (!part)
    return res
      .status(404)
      .send({ message: "The equipment part with the given ID was not found." });

  const deletedPart = await prisma.part.delete({ where: { id } });

  res.send(deletedPart);
});

export default router;
