import express, { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  ResponseBody,
} from "../entities/RequestQuery";
import { prisma } from "../prisma/client";

const router = express.Router();

interface RecordQuery {
  PHDTagIds: string[];
}

router.get(
  "/",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, RecordQuery>,
    res: Response
  ) => {
    const { PHDTagIds } = req.query;

    const where = PHDTagIds
      ? { PHDTagId: { in: PHDTagIds.map((id) => parseInt(id)) } }
      : {};

    const records = await prisma.record.findMany({
      orderBy: { timestamp: "asc" },
      where,
      include: { PHDTag: { include: { unit: true } } },
    });

    res.send(records);
  }
);

export default router;
