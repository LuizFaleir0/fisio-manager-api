import {
  ValidationOptions,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

/**
 *  Confimação de Campo
 * @description Verifica se os valores são iguais (shield1 === shield2)
 * @param shield Campo a ser verificado
 * @param validationOptions Opções de validação normal
 */
export function ConfirmedValidator(
  shield: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'Confimed',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [shield],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value === relatedValue
          );
        },
      },
    });
  };
}
