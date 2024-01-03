import { z } from "zod";

export const assetSchema = z.object({
  name: z.string().min(1).max(255),
});

export const equipmentSchema = z.object({
  name: z.string().min(1).max(255),
  assetId: z.number().min(1),
});

export const partSchema = z.object({
  name: z.string().min(1).max(255),
  equipmentId: z.number().min(1),
});

export const partParameterSchema = z.object({
  name: z.string().min(1).max(255),
  partId: z.number().min(1),
  parameterTypeId: z.number().min(1),
});

export const phdTagSchema = z.object({
  tagname: z.string().min(1).max(300),
  unitId: z.number().min(1),
});

export const unitSchema = z.object({
  name: z.string().min(1).max(255),
});

export const assignmentSchema = z.object({
  partParameterId: z.number().min(1),
  PHDTagId: z.number().min(1),
});

export const updateAssignmentSchema = z.object({
  PHDTagId: z.number().min(1),
});
