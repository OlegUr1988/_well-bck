import express, { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  ResponseBody,
} from "../entities/RequestQuery";
import { prisma } from "../prisma/client";
import { equipmentSchema } from "../schemas";
import Equipment from "../entities/Equipment";

const router = express.Router();

interface EquipmentQuery {
  assetId: string;
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, EquipmentQuery>,
    res: Response
  ) => {
    const { assetId } = req.query;

    const where = assetId
      ? {
          assetId: parseInt(assetId),
        }
      : {};

    const equipments = await prisma.equipment.findMany({ where });

    res.send(equipments);
  }
);

router.get("/:id", async (req, res) => {
  const equipment = await prisma.equipment.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { asset: true },
  });
  if (!equipment)
    return res
      .status(404)
      .send({ message: "The equipment with the given ID was not found." });

  res.send(equipment);
});

router.post("/", async (req, res) => {
  const validation = equipmentSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, assetId } = req.body as Equipment;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!asset)
    return res.status(400).send({ message: "Invalid asset was provided" });

  const newEquipment = await prisma.equipment.create({
    data: {
      name,
      assetId,
    },
  });

  res.status(201).send(newEquipment);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: { asset: true },
  });
  if (!equipment)
    return res
      .status(404)
      .send({ message: "The equipment with the given ID was not found." });

  const validation = equipmentSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, assetId } = req.body as Equipment;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!equipment)
    return res.status(400).send({ message: "Invalid asset was provided" });

  const updatedEquipment = await prisma.equipment.update({
    where: { id },
    data: { name, assetId },
  });

  res.send(updatedEquipment);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: {
      attribute: true,
    },
  });
  if (!equipment)
    return res
      .status(404)
      .send({ message: "The equipment with the given ID was not found." });

  await prisma.attribute.deleteMany({
    where: {
      equipmentId: id,
    },
  });

  await prisma.equipment.delete({ where: { id } });

  res.send(equipment);
});

export default router;
