import express, { Request, Response } from "express";
import Equipment from "../entities/Equipment";
import {
  RequestBody,
  RequestParams,
  ResponseBody,
} from "../entities/RequestQuery";
import auth from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { equipmentSchema } from "../schemas";

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

    const equipments = await prisma.equipment.findMany({
      where,
      include: {
        attribute: {
          include: { assignment: { include: { attribute: true } } },
        },
      },
    });

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

router.post("/", auth, async (req, res) => {
  const validation = equipmentSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, assetId } = req.body as Equipment;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!asset)
    return res.status(400).send({ message: "Invalid asset was provided" });

  await prisma.$transaction(async (tx) => {
    const newEquipment = await tx.equipment.create({
      data: {
        name,
        assetId,
      },
    });

    const dutyType = await tx.attributeType.findUnique({
      where: { name: "duty" },
    });

    if (dutyType) {
      const data = [
        {
          attributeTypeId: dutyType.id,
          equipmentId: newEquipment.id,
          name: "Duty",
        },
        {
          attributeTypeId: dutyType.id,
          equipmentId: newEquipment.id,
          name: "Useful work",
        },
      ];

      await tx.attribute.createMany({ data });
    }
    res.status(201).send(newEquipment);
  });
});

router.put("/:id", auth, async (req, res) => {
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

router.delete("/:id", auth, async (req, res) => {
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
