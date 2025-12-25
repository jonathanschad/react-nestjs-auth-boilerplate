// Type helper to ensure DTO enum matches Prisma enum exactly
export type ValidateEnum<TEnum extends string> = Record<TEnum, TEnum>;
