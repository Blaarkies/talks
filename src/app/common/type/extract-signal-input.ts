import { InputSignal } from '@angular/core';

export type ExtractInputs<T, RequiredKeys extends keyof T = never> = {
  [K in keyof T as K extends RequiredKeys ? K : never]: T[K] extends InputSignal<infer U> ? U : never;
} & {
  [K in keyof T as K extends RequiredKeys ? never : K]?: T[K] extends InputSignal<infer U> ? U : never;
}
