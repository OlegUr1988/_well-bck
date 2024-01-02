import ExcelJs, { Row } from "exceljs";
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { PHDTagLogger, PHDTagsLogPath, deleteLog } from "../logger";

export const exportToExcel = async (req: Request, res: Response) => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("PHD Tags");

  worksheet.addRow(["Tagname", "New Tagname", "Units"]);

  const tags = await prisma.pHDTag.findMany({ include: { unit: true } });

  tags.map((tag) => worksheet.addRow([tag.tagname, "", tag.unit.name]));

  // Set response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader("Content-Disposition", "attachment; filename=PHDTags.xlsx");

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
    deleteLog(PHDTagsLogPath);

    const buffer = req.file.buffer;
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet("PHD Tags");

    // check headers
    const headersRow = worksheet?.findRow(1) as Row;
    const headers = headersRow.values;
    if (
      Array.isArray(headers) &&
      headers[1]?.toLocaleString().toLowerCase() !== "tagname" &&
      headers[2]?.toLocaleString().toLowerCase() !== "new tagname" &&
      headers[3]?.toLocaleString().toLowerCase() !== "description"
    ) {
      PHDTagLogger.error(
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
            const [item, tagname, newTagname, unitsName] =
              row.values as string[];

            const oldTagname = await tx.pHDTag.findUnique({
              where: { tagname },
            });

            const units = await prisma.unit.findUnique({
              where: { name: unitsName },
            });

            if (newTagname) {
              if (newTagname.toLocaleLowerCase() === "delete") {
                await tx.pHDTag.delete({ where: { tagname } });
                PHDTagLogger.info(`The PHD tag "${tagname} was deleted`);
              } else {
                await tx.pHDTag.update({
                  where: { tagname },
                  data: {
                    tagname: newTagname,
                    unitId: units?.id,
                  },
                });
                PHDTagLogger.info(`The PHD tag "${tagname}" was updated`);
              }
            } else {
              if (!oldTagname) {
                await tx.pHDTag.create({
                  data: { tagname, unitId: units?.id! },
                });
                PHDTagLogger.info(`The PHD tag "${tagname}" was added`);
              } else if (oldTagname.unitId !== units?.id) {
                await tx.pHDTag.update({
                  where: { id: oldTagname.id },
                  data: { unitId: units?.id! },
                });
                PHDTagLogger.info(`The PHD tag "${tagname}" was updated`);
              } else {
                PHDTagLogger.info(`The PHD tag "${tagname}" was not changed`);
              }
            }
          })
        );
    });

    PHDTagLogger.info(
      `Successfuly imported. ${rowsNumber - 1} rows was/were imported.`
    );
    res.status(200).send();
  } catch (error) {
    PHDTagLogger.error(error);
    res.status(500).send({ message: "An unexpected error occured.", error });
  }
};
