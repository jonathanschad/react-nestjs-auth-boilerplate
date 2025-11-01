import { registerDecorator, type ValidationArguments, type ValidationOptions } from 'class-validator';

export function IsTrue(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'isTrue',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown) {
                    return value === true;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be true`;
                },
            },
        });
    };
}
