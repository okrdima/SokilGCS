export type Unit =
  | 'm'
  | 'm/s'
  | 'deg'
  | 'rad'
  | 'W'
  | 'A'
  | 'V';

export interface UnitUtils {
  /**
   * Simple utility to format a value with its unit.
   */
  format(value: number, unit: Unit): string;
}
