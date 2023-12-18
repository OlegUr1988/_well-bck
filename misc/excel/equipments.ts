import ExcelJs, { Row } from "exceljs";
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { deleteLog, equipmentLogger, equipmentsLogPath } from "../logger";

export const exportToExcel = async (req: Request, res: Response) => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Equipments");

  worksheet.addRow(["Name", "New Name", "Asset"]);

  const equipments = await prisma.equipment.findMany({
    include: { asset: true },
  });

  equipments.map((equipment) =>
    worksheet.addRow([equipment.name, "", equipment.asset.name])
  );

  // Set response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader("Content-Disposition", "attachment; filename=equipments.xlsx");

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
    deleteLog(equipmentsLogPath);

    const buffer = req.file.buffer;
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet("Equipments");

    // check headers
    const headersRow = worksheet?.findRow(1) as Row;
    const headers = headersRow.values;
    if (
      Array.isArray(headers) &&
      headers[1]?.toLocaleString().toLowerCase() !== "name" &&
      headers[2]?.toLocaleString().toLowerCase() !== "new name" &&
      headers[3]?.toLocaleString().toLowerCase() !== "asset"
    ) {
      equipmentLogger.error(
        `Invalid headers provided in excel file: ${headers.slice(1)}`
      );
      return res.status(400).send({ message: "Invalid headers" });
    }

    const rowsNumber = worksheet?.rowCount!;

    // starting transaction
    await prisma.$transaction(async (tx) => {
      const rows = worksheet?.findRows(2, rowsNumber);
      if (rows)
        await Promise.all(
          rows.map(async (row) => {
            const [item, name, newName, assetName] = row.values as string[];

            const asset = await tx.asset.findUnique({
              where: { name: assetName },
            });
            if (!asset)
              throw new Error(
                `The invalid asset name was provided: "${assetName}"`
              );

            const oldName = await tx.equipment.findUnique({
              where: { name },
              include: { asset: true },
            });
            const oldAsset = oldName?.asset.name;

            if (newName) {
              if (newName.toLowerCase() === "delete") {
                await tx.equipment.delete({ where: { name } });
                equipmentLogger.info(`The equipment "${name}" was deleted`);
              } else {
                await tx.equipment.update({
                  where: { name },
                  data: {
                    name: newName,
                    assetId: asset.id,
                  },
                });
                equipmentLogger.info(
                  `The equipment "${name}" was renamed to "${newName}". ${
                    assetName !== oldAsset
                      ? `Assigned to asset: ${assetName}`
                      : `Asset: ${assetName}`
                  }`
                );
              }
            } else {
              if (!oldName) {
                await tx.equipment.create({
                  data: {
                    name,
                    assetId: asset.id,
                  },
                });
                equipmentLogger.info(
                  `The equipment "${name}" was added. Asset: "${assetName}"`
                );
              } else if (oldAsset !== assetName) {
                await tx.equipment.update({
                  where: { id: oldName?.id },
                  data: { assetId: asset.id },
                });

                equipmentLogger.info(
                  `The equipment "${name}" was assigned to new asset: "${assetName}"`
                );
              } else {
                equipmentLogger.info(
                  `The equipment "${name}" was not changed. Asset: "${assetName}"`
                );
              }
            }
          })
        );
    });

    equipmentLogger.info(
      `Successfuly imported. ${rowsNumber - 1} rows was/were imported.`
    );
    res.status(200).send();
  } catch (error) {
    equipmentLogger.error(error);
    res.status(500).send({ message: "An unexpected error occured.", error });
  }
};
