import express, { Request, Response } from "express";
import Asset from "../entities/Asset";
import { prisma } from "../prisma/client";
import { assetSchema } from "../schemas";
import ExcelJs, { Workbook } from "exceljs";

const router = express.Router();

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  page: string;
  pageSize: string;
  searchedName: string;
}

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
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Assets");

  worksheet.addRow(["ID", "Name"]);

  const assets = await prisma.asset.findMany();

  assets.map((asset) => worksheet.addRow([asset.id, asset.name]));

  // Set response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader("Content-Disposition", "attachment; filename=assets.xlsx");

  // Send the workbook as a response
  await workbook.xlsx.write(res);
  res.end();
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
  const validation = assetSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name } = req.body as Asset;

  const assetWithTheSameName = await prisma.asset.findUnique({
    where: { name },
  });

  if (assetWithTheSameName)
    return res.status(400).send("The asset with this name is already exists.");

  const newAsset = await prisma.asset.create({ data: { name } });

  res.status(201).send(newAsset);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const asset = await prisma.asset.findUnique({
    where: { id },
  });
  if (!asset)
    return res.status(404).send("The asset with the given ID was not found.");

  const validation = assetSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { name } = req.body as Asset;

  const assetWithTheSameName = await prisma.asset.findUnique({
    where: { name },
  });

  if (assetWithTheSameName)
    return res.status(400).send("The asset with this name is already exists.");

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
    return res.status(404).send("The asset with the given ID was not found.");

  await prisma.asset.delete({ where: { id } });

  res.send(asset);
});

export default router;
