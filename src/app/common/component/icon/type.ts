import { filledIconAliases } from './filled-icons';
import { outlinedIconAliases } from './outlined-icons';

export type IconAlias = keyof typeof filledIconAliases
  | keyof typeof outlinedIconAliases;

export interface IconComponentConfig {
  size: number;
}