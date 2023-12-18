import ExcelJs, { Row } from "exceljs";
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { assetLogger, assetLogPath, deleteLog } from "../logger";

export const exportToExcel = async (req: Request, res: Response) => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Assets");

  worksheet.addRow(["Name", "New Name"]);

  const assets = await prisma.asset.findMany();

  assets.map((asset) => worksheet.addRow([asset.name]));

  // Set response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader("Content-Disposition", "attachment; filename=assets.xlsx");

  // Send the workbook as a response
  await workbook.xlsx.write(res);
  res.end();
};

export const importFromExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    // Deleting previous log file
    deleteLog(assetLogPath);

    const buffer = req.file.buffer;
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet("Assets");

    // check headers
    const headersRow = worksheet?.findRow(1) as Row;
    const headers = headersRow.values;
    if (
      Array.isArray(headers) &&
      headers[1]?.toLocaleString().toLowerCase() !== "name" &&
      headers[2]?.toLocaleString().toLowerCase() !== "new name"
    ) {
      assetLogger.error(
        `Invalid headers provided in excel file: ${headers.slice(1)}`
      );
      return res.status(400).send({ message: "Invalid headers" });
    }

    const rowsNumber = worksheet?.rowCount!;

    // getting data from excel
    await prisma.$transaction(async (tx) => {
      const rows = worksheet?.findRows(2, rowsNumber);
      if (rows)
        await Promise.all(
          rows?.map(async (row) => {
            const [item, name, newName] = row.values as string[];

            if (newName) {
              if (newName.toLowerCase() === "delete") {
                await tx.asset.delete({ where: { name } });
                assetLogger.info(`The asset "${name} was deleted".`);
              } else {
                await tx.asset.update({
                  where: { name },
                  data: { name: newName },
                });
                assetLogger.info(
                  `The asset "${name}" was renamed to "${newName}".`
                );
              }
            } else {
              const oldName = await tx.asset.findUnique({ where: { name } });
              if (!oldName) {
                await tx.asset.create({ data: { name } });
                assetLogger.info(`The new "${name}" was added.`);
              }
              assetLogger.info(`The asset "${name}" was not changed.`);
            }
          })
        );
    });

    assetLogger.info(
      `Successfuly imported. ${rowsNumber - 1} rows was/were imported.`
    );
    res.status(200).send();
  } catch (error) {
    assetLogger.error(error);
    res.status(500).send({ message: "An unexpected error occured.", error });
  }
};
