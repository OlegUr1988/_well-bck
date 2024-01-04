import express from "express";
import { prisma } from "../prisma/client";
import { areaSchema } from "../schemas";
import Area from "../entities/Area";

const router = express.Router();

router.get("/", async (req, res) => {
  const areas = await prisma.area.findMany();

  res.send(areas);
});

router.get("/:id", async (req, res) => {
  const area = await prisma.area.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!area)
    return res
      .status(404)
      .send({ message: "The area with the given ID was not found." });

  res.send(area);
});

router.post("/", async (req, res) => {
  const validation = areaSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name } = req.body as Area;

  const areaWithTheSameName = await prisma.area.findUnique({
    where: { name },
  });

  if (areaWithTheSameName)
    return res
      .status(400)
      .send({ message: "The area with this name is already exists." });

  const newArea = await prisma.area.create({ data: { name } });

  res.status(201).send(newArea);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const area = await prisma.area.findUnique({
    where: { id },
  });
  if (!area)
    return res
      .status(404)
      .send({ message: "The area with the given ID was not found." });

  const validation = areaSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name } = req.body as Area;

  const areaWithTheSameName = await prisma.asset.findUnique({
    where: { name },
  });

  if (areaWithTheSameName && areaWithTheSameName.id !== id)
    return res
      .status(400)
      .send({ message: "The area with this name is already exists." });

  const updatedArea = await prisma.area.update({
    where: { id },
    data: { name },
  });

  res.status(200).send(updatedArea);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const area = await prisma.area.findUnique({
    where: { id },
  });
  if (!area)
    return res
      .status(404)
      .send({ message: "The area with the given ID was not found." });

  await prisma.area.delete({ where: { id } });

  res.send(area);
});

export default router;
