import { z } from 'zod';

export const BaseEntitySchema = z.object({
  _id: z.string().uuid(),
  _createdAt: z.date().or(z.string().datetime()),
  _updatedAt: z.date().or(z.string().datetime()),
  _createdBy: z.string().uuid().optional(),
  _updatedBy: z.string().uuid().optional(),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
