import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const prisma = new PrismaClient();
const router = express.Router();

// GET all assets, including their utility type.
// The frontend will be responsible for building the tree structure.
router.get('/', async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        utilityType: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// POST a new asset
router.post('/', [auth, admin], async (req: Request, res: Response) => {
  const { name, parentAssetId, utilityTypeName } = req.body;

  // Default to 'Field' if utilityTypeName is missing
  const effectiveUtilityTypeName = utilityTypeName || 'Field';

  if (!name || !effectiveUtilityTypeName) {
    return res.status(400).json({ error: '`name` and `utilityTypeName` are required.' });
  }

  try {
    const utilityType = await prisma.utilityType.findUnique({
      where: { name: effectiveUtilityTypeName },
    });

    if (!utilityType) {
      return res.status(400).json({ error: `UtilityType '${effectiveUtilityTypeName}' not found.` });
    }

    const attributeTypes = await prisma.attributeType.findMany();

    const newAsset = await prisma.asset.create({
      data: {
        name,
        parentAssetId: parentAssetId ? parseInt(parentAssetId, 10) : null,
        utilityTypeId: utilityType.id,
        attributes: {
          create: attributeTypes.map((at) => ({
            name: at.name,
            attributeTypeId: at.id,
          })),
        },
      },
    });

    res.status(201).json(newAsset);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return res.status(409).json({ error: `An asset with the name '${name}' already exists.` });
    }
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

export default router;