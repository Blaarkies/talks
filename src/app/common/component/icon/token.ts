import { InjectionToken } from '@angular/core';
import { iconMap } from './aliases';
import { IconComponentConfig } from './type';

export let ICON_MAP = new InjectionToken(
  'List of icon aliases', {
    providedIn: 'root',
    factory: () => iconMap,
  });

export let defaultConfig: IconComponentConfig = {
  size: 32,
};

export let ICON_COMPONENT_CONFIG = new InjectionToken<IconComponentConfig>(
  'Config for icon default values',
  {factory: () => defaultConfig});
