import express from "express";
import auth from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { attributeSchema } from "../schemas";
import { Attribute } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  async (
    req,
    res
  ) => {
    const { assetId } = req.query as unknown as Attribute;

    const where = assetId
      ? {
          assetId,
        }
      : {};

    const attributes = await prisma.attribute.findMany({
      where,
      include: { attributeType: true, assignment: true },
    });

    res.send(attributes);
  }
);

router.get("/:id", async (req, res) => {
  const attribute = await prisma.attribute.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { asset: true },
  });
  if (!attribute)
    return res
      .status(404)
      .send({ message: "The attribute with the given ID was not found." });

  res.send(attribute);
});

router.post("/", auth, async (req, res) => {
  const validation = attributeSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, assetId, attributeTypeId } = req.body as Attribute;

  const equipment = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!equipment)
    return res.status(400).send({ message: "Invalid asset was provided" });

  const newAttribute = await prisma.attribute.create({
    data: {
      name,
      assetId,
      attributeTypeId,
    },
  });

  res.status(201).send(newAttribute);
});

router.put("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);

  const attribute = await prisma.attribute.findUnique({
    where: { id },
    include: { asset: true },
  });
  if (!attribute)
    return res
      .status(404)
      .send({ message: "The attribute with the given ID was not found." });

  const validation = attributeSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, assetId, attributeTypeId } = req.body as Attribute;

  const equipment = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!equipment)
    return res.status(400).send({ message: "Invalid equipment was provided" });

  const updatedAttribute = await prisma.attribute.update({
    where: { id },
    data: { name, assetId, attributeTypeId },
  });

  res.send(updatedAttribute);
});

router.delete("/:id", auth, async (req, res) => {
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
