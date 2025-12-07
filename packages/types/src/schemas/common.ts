import { z } from 'zod';

// Pagination schemas
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const paginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
    z.object({
        data: z.array(dataSchema),
        pagination: paginationSchema,
    });

export type Pagination = z.infer<typeof paginationSchema>;

export type PaginatedResponse<T> = {
    data: T[];
    pagination: Pagination;
};
