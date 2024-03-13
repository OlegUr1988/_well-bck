import express from "express";
import { prisma } from "../prisma/client";

const router = express.Router();

router.get("/", async (req, res) => {
  const types = await prisma.utilityType.findMany({
    orderBy: { id: "asc" },
  });

  res.send(types);
});

export default router;
