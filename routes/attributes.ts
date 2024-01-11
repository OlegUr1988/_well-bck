import express, { Request, Response } from "express";
import Attribute from "../entities/Attribute";
import {
  RequestBody,
  RequestParams,
  ResponseBody,
} from "../entities/RequestQuery";
import { prisma } from "../prisma/client";
import { attributeSchema } from "../schemas";

const router = express.Router();

interface AttributeQuery {
  equipmentId: string;
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, AttributeQuery>,
    res: Response
  ) => {
    const { equipmentId } = req.query;

    const where = equipmentId
      ? {
          equipmentId: parseInt(equipmentId),
        }
      : {};

    const params = await prisma.attribute.findMany({
      where,
      include: { attributeType: true },
    });

    res.send(params);
  }
);

router.get("/:id", async (req, res) => {
  const attribute = await prisma.attribute.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { equipment: true },
  });
  if (!attribute)
    return res
      .status(404)
      .send({ message: "The attribute with the given ID was not found." });

  res.send(attribute);
});

router.post("/", async (req, res) => {
  const validation = attributeSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, equipmentId, attributeTypeId } = req.body as Attribute;

  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
  });
  if (!equipment)
    return res.status(400).send({ message: "Invalid equipment was provided" });

  const newAttribute = await prisma.attribute.create({
    data: {
      name,
      equipmentId,
      attributeTypeId,
    },
  });

  res.status(201).send(newAttribute);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const attribute = await prisma.attribute.findUnique({
    where: { id },
    include: { equipment: true },
  });
  if (!attribute)
    return res
      .status(404)
      .send({ message: "The attribute with the given ID was not found." });

  const validation = attributeSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, equipmentId, attributeTypeId } = req.body as Attribute;

  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
  });
  if (!equipment)
    return res.status(400).send({ message: "Invalid equipment was provided" });

  const updatedAttribute = await prisma.attribute.update({
    where: { id },
    data: { name, equipmentId, attributeTypeId },
  });

  res.send(updatedAttribute);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const attribute = await prisma.attribute.findUnique({
    where: { id },
  });
  if (!attribute)
    return res
      .status(404)
      .send({ message: "The attribute with the given ID was not found." });

  await prisma.attribute.delete({ where: { id } });

  res.send(attribute);
});

export default router;
