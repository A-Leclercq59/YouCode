import { z } from "zod";

export const formSchemaUpdateUser = z.object({
  name: z.string().min(3).max(40),
  image: z.string().url(),
});
