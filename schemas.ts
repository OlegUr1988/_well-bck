import { z } from "zod";

export const assetSchema = z.object({
  name: z.string().min(1).max(255),
});

export const equipmentSchema = z.object({
  name: z.string().min(1).max(255),
  assetId: z.number().min(1),
});

export const phdTagSchema = z.object({
  tagname: z.string().min(1).max(300),
  description: z.string(),
});
