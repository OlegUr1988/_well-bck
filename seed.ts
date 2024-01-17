import { prisma } from "./prisma/client";

const units = [
  {
    name: "%",
  },
  { name: "kWh" },
  { name: "ton CO2" },
];

const attributeTypes = [{ name: "Duty" }, { name: "Loss" }];

const fillTables = async () => {
  try {
    await prisma.unit.createMany({ data: units });
    await prisma.attributeType.createMany({ data: attributeTypes });
  } catch (error) {
    console.log(error);
  }
};

export default fillTables;
