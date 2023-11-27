import express from "express";
import Asset from "../entities/Asset";
import { prisma } from "../prisma/client";
import { assetSchema } from "../schemas";

const router = express.Router();

router.get("/", async (req, res) => {
  const assets = await prisma.asset.findMany();
  res.send(assets);
});

router.get("/:id", async (req, res) => {
  const asset = await prisma.asset.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!asset)
    return res.status(404).send("The asset with the given ID was not found.");

  res.send(asset);
});

router.post("/", async (req, res) => {
  const { name } = req.body as Asset;

  const validation = assetSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const asset = await prisma.asset.findUnique({
    where: { name },
  });

  if (asset?.name === name)
    return res.status(400).send("The asset with this name is already exists.");

  const newAsset = await prisma.asset.create({ data: { name } });

  res.status(201).send(newAsset);
});

export default router;
