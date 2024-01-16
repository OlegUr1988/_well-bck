import express from "express";
import { prisma } from "../prisma/client";

const router = express.Router();

router.get("/", async (req, res) => {
  const records = await prisma.record.findMany({
    orderBy: { timestamp: "asc" },
  });

  return records;
});

export default router;
