import { z } from "zod";

export const areaSchema = z.object({
  name: z.string().min(1).max(255),
});

export const assetSchema = z.object({
  name: z.string().min(1).max(255),
  areaId: z.number().min(1),
});

export const equipmentSchema = z.object({
  name: z.string().min(1).max(255),
  assetId: z.number().min(1),
});

export const attributeSchema = z.object({
  name: z.string().min(1).max(255),
  equipmentId: z.number().min(1),
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
  password: z.string().min(1).max(255),
});
