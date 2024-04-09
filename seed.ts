import { prisma } from "./prisma/client";

const dataSource = {
  host: "localhost",
  port: 3152,
};

const utilityTypes = [
  { name: "Plant" },
  { name: "Area" },
  { name: "Gas" },
  { name: "Steam" },
  { name: "Electricity" },
  { name: "Heat" },
];

const units = [
  {
    name: "%",
  },
  { name: "kWh" },
  { name: "Ton" },
  { name: "Ton CO2" },
];

const attributeTypes = [
  { name: "Duty" },
  { name: "Design Loss" },
  { name: "Operating Loss" },
  { name: "Area Attribute" },
];

const constants = [{ name: "CO2 conversion coefficient", value: 0.181048239 }];

const fillTables = async () => {
  try {
    await prisma.dataSource.create({ data: dataSource });
    await prisma.utilityType.createMany({ data: utilityTypes });
    await prisma.unit.createMany({ data: units });
    await prisma.attributeType.createMany({ data: attributeTypes });
    await prisma.constant.createMany({ data: constants });
  } catch (error) {
    console.log(error);
  }
};

export default fillTables;
