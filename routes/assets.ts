import express, { Request, Response } from "express";
import auth from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { assetSchema } from "../schemas";
import { Asset } from "@prisma/client";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../entities/RequestQuery";

const router = express.Router();

interface AssetQuery extends RequestQuery {
  name: string;
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, AssetQuery>,
    res: Response
  ) => {
    const { name } = req.query as AssetQuery;

    if (name) {
      const asset = await prisma.asset.findUnique({
        where: { name },
        include: {
          attributes: {
            include: {
              assignments: { include: { attribute: true } },
            },
          },
          children: {
            include: { attributes: { include: { assignments: true } } },
          },
          target: true,
        },
      });
      if (!asset)
        return res
          .status(404)
          .send({ message: "The asset with given name was not found." });
      return res.send(asset);
    }

    const assets = await prisma.asset.findMany({ include: { children: true } });

    res.send(assets);
  }
);

router.get("/:id", async (req, res) => {
  const asset = await prisma.asset.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      utilityType: true,
      children: {
        include: {
          attributes: {
            include: { assignments: { include: { attribute: true } } },
          },
        },
      },
    },
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

  const { name, parentAssetId, utilityTypeId } = req.body as Asset;

  const assetWithSameName = await prisma.asset.findUnique({
    where: { name },
  });
  if (assetWithSameName)
    return res
      .status(400)
      .send({ message: "The asset with the same name already exist." });

  if (parentAssetId) {
    const parentAsset = await prisma.asset.findUnique({
      where: { id: parentAssetId },
    });
    if (!parentAsset)
      return res
        .status(400)
        .send({ message: "Invalid parrent asset ID was provided" });
  }

  const newAsset = await prisma.asset.create({
    data: {
      name,
      parentAssetId,
      utilityTypeId,
    },
  });

  res.status(201).send(newAsset);
});

router.put("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);

  const asset = await prisma.asset.findUnique({
    where: { id },
  });
  if (!asset)
    return res
      .status(404)
      .send({ message: "The asset with the given ID was not found." });

  const validation = assetSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name } = req.body as Asset;

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
    data: { name },
  });

  res.send(updatedAsset);
});

router.delete("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      children: true,
    },
  });
  if (!asset)
    return res
      .status(404)
      .send({ message: "The asset with the given ID was not found." });

  if (asset.children.length)
    return res
      .status(500)
      .send({ message: "The asset has one or more subassets" });

  await prisma.asset.delete({ where: { id } });

  res.send(asset);
});

export default router;
