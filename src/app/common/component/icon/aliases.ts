import { filledIconAliases } from './filled-icons';
import { outlinedIconAliases } from './outlined-icons';
import { IconAlias } from './type';

let iconsPath = `asset/icons`;
let filledIcons = Object.entries(filledIconAliases)
  .map(([k, v]) => [k, `${iconsPath}/filled/${v}.svg`]);

let outlinedIcons = Object.entries(outlinedIconAliases)
  .map(([k, v]) => [k, `${iconsPath}/outline/${v}.svg`]);

export const iconMap = new Map<IconAlias, string>(
  filledIcons.concat(outlinedIcons) as [IconAlias, string][]);