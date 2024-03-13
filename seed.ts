import { prisma } from "./prisma/client";

const dataSource = {
  host: "localhost",
  port: 3152,
};

const utilityTypes = [
  { name: "Area" },
  { name: "Gas" },
  { name: "Steam" },
  { name: "Electricity" },
  { name: "Heat" },
  { name: "Subasset" },
];

const units = [
  {
    name: "%",
  },
  { name: "kWh" },
  { name: "ton CO2" },
];

const attributeTypes = [
  { name: "Duty" },
  { name: "Design Loss" },
  { name: "Operating Loss" },
  { name: "Area Attribute" },
];

const fillTables = async () => {
  try {
    await prisma.dataSource.create({ data: dataSource });
    await prisma.utilityType.createMany({ data: utilityTypes });
    await prisma.unit.createMany({ data: units });
    await prisma.attributeType.createMany({ data: attributeTypes });
  } catch (error) {
    console.log(error);
  }
};

export default fillTables;
