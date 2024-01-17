import { Record } from "@prisma/client";
import express, { Request, Response } from "express";
import _ from "lodash";
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

    let records: Record[] = [];

    for (let id of PHDTagIds) {
      const record = await prisma.record.findMany({
        where: {
          PHDTagId: parseInt(id),
        },
        include: { PHDTag: { include: { unit: true } } },
      });
      records = _.concat(records, record);
    }

    res.send(records);
  }
);

export default router;
