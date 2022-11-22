import { ValueType } from '../../../Values/ValueType';

export const BooleanValue = new ValueType(
  'boolean',
  () => false,
  (value: string | boolean) =>
    typeof value === 'string' ? value.toLowerCase() === 'true' : value,
  (value: boolean) => value
);