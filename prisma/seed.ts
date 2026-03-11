// c:\_ProjectCode\____Wells\aos-bck-energy\prisma\seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding reference data...");

  // 1. Units
  const unitM3h = await prisma.unit.upsert({
    where: { name: "m3/h" },
    update: {},
    create: { name: "m3/h", description: "Cubic meters per hour" },
  });

  // 2. Utility Types (Asset Types)
  // We exclude Gas, Steam, Electricity, Heat by simply not creating them or relying on migration to clean them up.
  // We ensure Field, Cluster, Well, and Pipeline exist.
  const utilityTypes = [
    { name: "Field", description: "Oil and Gas Field (Root)" },
    { name: "Cluster", description: "Production Cluster" },
    { name: "Well", description: "Oil/Gas Well" },
    { name: "Pipeline", description: "Transport Pipeline" },
  ];

  for (const ut of utilityTypes) {
    await prisma.utilityType.upsert({
      where: { name: ut.name },
      update: {},
      create: ut,
    });
  }

  // 3. Attribute Types
  // Defining standard attributes for production analytics
  const attributes = [
    // Actuals
    { name: "BOE Flow Actual", description: "BOE Flow Actual", unitId: unitM3h.id, dataType: "Float" },
    { name: "GAS Flow Actual", description: "GAS Flow Actual", unitId: unitM3h.id, dataType: "Float" },
    { name: "OIL Flow Actual", description: "OIL Flow Actual", unitId: unitM3h.id, dataType: "Float" },
    { name: "WATER Flow Actual", description: "WATER Flow Actual", unitId: unitM3h.id, dataType: "Float" },
    // Targets
    { name: "BOE Flow Target", description: "BOE Flow Target", unitId: unitM3h.id, dataType: "Float" },
    { name: "GAS Flow Target", description: "GAS Flow Target", unitId: unitM3h.id, dataType: "Float" },
    { name: "OIL Flow Target", description: "OIL Flow Target", unitId: unitM3h.id, dataType: "Float" },
    { name: "WATER Flow Target", description: "WATER Flow Target", unitId: unitM3h.id, dataType: "Float" },
  ];

  for (const attr of attributes) {
    await prisma.attributeType.upsert({
      where: { name: attr.name },
      update: { unitId: attr.unitId },
      create: {
        name: attr.name, 
        description: attr.description,
        unitId: attr.unitId,
        dataType: attr.dataType,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
