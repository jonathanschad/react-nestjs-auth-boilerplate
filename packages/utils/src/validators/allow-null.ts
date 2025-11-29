import { ValidateIf, type ValidationOptions } from 'class-validator';

export function AllowNull(validationOptions?: ValidationOptions) {
    return ValidateIf((_object: object, value: unknown) => value !== null, validationOptions);
}
