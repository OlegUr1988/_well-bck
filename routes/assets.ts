import express, { Request, Response } from "express";
import Asset from "../entities/Asset";
import {
  RequestBody,
  RequestParams,
  ResponseBody,
} from "../entities/RequestQuery";
import auth from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { assetSchema } from "../schemas";

const router = express.Router();

interface AssetQuery {
  areaId: string;
  name: string;
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, AssetQuery>,
    res: Response
  ) => {
    const { areaId, name } = req.query;

    if (name) {
      const asset = await prisma.asset.findUnique({ where: { name } });
      if (!asset)
        return res
          .status(404)
          .send({ message: "The asset with given name was not found." });
      return res.send(asset);
    }

    const where = areaId
      ? {
          areaId: parseInt(areaId),
        }
      : {};

    const assets = await prisma.asset.findMany({ where });

    res.send(assets);
  }
);

router.get("/:id", async (req, res) => {
  const asset = await prisma.asset.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { area: true },
  });
  if (!asset)
    return res
      .status(404)
      .send({ message: "The asset with the given ID was not found." });

  res.send(asset);
});

router.post("/", auth, async (req, res) => {
  const validation = assetSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, areaId } = req.body as Asset;

  const area = await prisma.area.findUnique({ where: { id: areaId } });
  if (!area)
    return res.status(400).send({ message: "Invalid area was provided" });

  const assetWithSameName = await prisma.asset.findUnique({
    where: { name },
  });
  if (assetWithSameName)
    return res
      .status(400)
      .send({ message: "The asset with the same name already exist." });

  const newAsset = await prisma.asset.create({
    data: {
      name,
      areaId,
    },
  });

  res.status(201).send(newAsset);
});

router.put("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: { area: true },
  });
  if (!asset)
    return res
      .status(404)
      .send({ message: "The asset with the given ID was not found." });

  const validation = assetSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name, areaId } = req.body as Asset;

  const area = await prisma.area.findUnique({ where: { id: areaId } });
  if (!asset)
    return res.status(400).send({ message: "Invalid area was provided" });

  const assetWithSameName = await prisma.asset.findUnique({
    where: { name },
  });
  if (
    assetWithSameName &&
    assetWithSameName.name === name &&
    assetWithSameName.id !== id
  )
    return res
      .status(400)
      .send({ message: "The asset with the same name already exist." });

  const updatedAsset = await prisma.asset.update({
    where: { id },
    data: { name, areaId },
  });

  res.send(updatedAsset);
});

router.delete("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      equipment: true,
    },
  });
  if (!asset)
    return res
      .status(404)
      .send({ message: "The asset with the given ID was not found." });

  if (asset.equipment.length)
    return res
      .status(500)
      .send({ message: "The asset has one or more equipments" });

  await prisma.asset.delete({ where: { id } });

  res.send(asset);
});

export default router;
