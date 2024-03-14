import { z } from "zod";

export const assetSchema = z.object({
  name: z.string().min(1).max(255),
});

export const attributeSchema = z.object({
  name: z.string().min(1).max(255),
  assetId: z.number().min(1),
  attributeTypeId: z.number().min(1),
});

export const phdTagSchema = z.object({
  tagname: z.string().min(1).max(300),
  unitId: z.number().min(1),
});

export const unitSchema = z.object({
  name: z.string().min(1).max(255),
});

export const assignmentSchema = z.object({
  attributeId: z.number().min(1),
  PHDTagId: z.number().min(1),
});

export const updateAssignmentSchema = z.object({
  PHDTagId: z.number().min(1),
});

export const dataSourceSchema = z.object({
  host: z.string().min(1).max(300),
  port: z.number().min(1),
});

export const userSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(4).max(255),
});

export const updateUserSchema = z.object({
  username: z.string().min(1).max(50),
  isAdmin: z.boolean(),
});

export const updateUserPasswordSchema = z.object({
  password: z.string().min(4).max(255),
});

export const targetSchema = z.object({
  productionTarget: z.number(),
  energyConsumptionTarget: z.number(),
  specificEnergyConsupmtionTarget: z.number(),
  CO2EmissionTarget: z.number(),
  assetId: z.number().min(1),
});

export const updateTargetSchema = z.object({
  productionTarget: z.number().optional(),
  energyConsumptionTarget: z.number().optional(),
  specificEnergyConsupmtionTarget: z.number().optional(),
  CO2EmissionTarget: z.number().optional(),
});
