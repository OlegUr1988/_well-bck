import { Equipment } from "@prisma/client";
import express, { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  ResponseBody,
} from "../entities/RequestQuery";
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

    const equipments = await prisma.equipment.findMany({ where });

    res.send(equipments);
  }
);

// router.get("/exportToExcel", (req, res) => {
//   exportToExcel(req, res);
// });

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

  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset)
    return res.status(400).send({ message: "Invalid asset was provided" });

  const equipmentWithSameName = await prisma.equipment.findUnique({
    where: { name },
  });
  if (equipmentWithSameName)
    return res
      .status(400)
      .send({ message: "The equipment with the same name already exist." });

  const newEquipment = await prisma.equipment.create({
    data: {
      name,
      assetId,
    },
  });

  res.status(201).send(newEquipment);
});

// router.post("/importFromExcel", upload.single("excelFile"), (req, res) => {
//   importFromExcel(req, res);
// });

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

  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset)
    return res.status(400).send({ message: "Invalid asset provided" });

  const equipmentWithSameName = await prisma.equipment.findUnique({
    where: { name },
  });
  if (
    equipmentWithSameName &&
    equipmentWithSameName.name === name &&
    equipmentWithSameName.id !== id
  )
    return res
      .status(400)
      .send({ message: "The equipment with the same name already exist." });

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
  });
  if (!equipment)
    return res
      .status(404)
      .send({ message: "The equipment with the given ID was not found." });

  const deletedEquipment = await prisma.equipment.delete({ where: { id } });

  res.send(deletedEquipment);
});

export default router;
