import { z } from "zod";

export const assetSchema = z.object({
  name: z.string().max(255),
});
