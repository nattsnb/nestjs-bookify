import { ValidateIf } from 'class-validator';

export function CanBeUndefined(): PropertyDecorator {
  return ValidateIf((_, value) => value !== undefined);
}
