import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET all utility types
router.get('/', async (req, res) => {
  try {
    const utilityTypes = await prisma.utilityType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    res.json(utilityTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch utility types' });
  }
});

export default router;