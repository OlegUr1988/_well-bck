import { prisma } from "./prisma/client";

const dataSource = {
  host: "localhost",
  port: 3152,
};

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
    await prisma.dataSource.create({ data: dataSource });
    await prisma.unit.createMany({ data: units });
    await prisma.attributeType.createMany({ data: attributeTypes });
  } catch (error) {
    console.log(error);
  }
};

export default fillTables;
