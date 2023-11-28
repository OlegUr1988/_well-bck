import express, { Request, Response } from "express";
import Asset from "../entities/Asset";
import { prisma } from "../prisma/client";
import { assetSchema } from "../schemas";

const router = express.Router();

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  page: string;
  pageSize: string;
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) => {
    const { page, pageSize } = req.query;

    let assets;

    const count = await prisma.asset.count();

    if (page && pageSize) {
      assets = await prisma.asset.findMany({
        orderBy: { name: "asc" },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize),
      });
    } else {
      assets = await prisma.asset.findMany({ orderBy: { name: "asc" } });
    }
    res.send({
      assets,
      count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  }
);

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
