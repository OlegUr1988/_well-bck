import express, { Request, Response } from "express";
import multer from "multer";
import Asset from "../entities/Asset";
import { exportToExcel, importFromExcel } from "../misc/excel/assets";
import { prisma } from "../prisma/client";
import { assetSchema } from "../schemas";

const router = express.Router();

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  page: string;
  pageSize: string;
  searchedName: string;
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) => {
    const { page, pageSize, searchedName } = req.query;

    const where = {
      name: {
        contains: searchedName,
      },
    };

    const orderBy = { id: "asc" } as const;

    const count = await prisma.asset.count();

    const assets =
      page && pageSize
        ? await prisma.asset.findMany({
            where,
            orderBy,
            skip: (parseInt(page) - 1) * parseInt(pageSize),
            take: parseInt(pageSize),
          })
        : await prisma.asset.findMany({
            orderBy,
            where,
          });

    res.send({
      count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      results: assets,
    });
  }
);

router.get("/exportToExcel", async (req, res) => {
  exportToExcel(req, res);
});

router.get("/:id", async (req, res) => {
  const asset = await prisma.asset.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!asset)
    return res
      .status(404)
      .send({ message: "The asset with the given ID was not found." });

  res.send(asset);
});

router.post("/", async (req, res) => {
  const validation = assetSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name } = req.body as Asset;

  const assetWithTheSameName = await prisma.asset.findUnique({
    where: { name },
  });

  if (assetWithTheSameName)
    return res
      .status(400)
      .send({ message: "The asset with this name is already exists." });

  const newAsset = await prisma.asset.create({ data: { name } });

  res.status(201).send(newAsset);
});

router.post(
  "/importFromExcel",
  upload.single("excelFile"),
  async (req, res) => {
    importFromExcel(req, res);
  }
);

router.put("/:id", async (req, res) => {
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

  const assetWithTheSameName = await prisma.asset.findUnique({
    where: { name },
  });

  if (assetWithTheSameName)
    return res
      .status(400)
      .send({ message: "The asset with this name is already exists." });

  const updatedAsset = await prisma.asset.update({
    where: { id },
    data: { name },
  });

  res.status(200).send(updatedAsset);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const asset = await prisma.asset.findUnique({
    where: { id },
  });
  if (!asset)
    return res
      .status(404)
      .send({ message: "The asset with the given ID was not found." });

  await prisma.asset.delete({ where: { id } });

  res.send(asset);
});

export default router;
