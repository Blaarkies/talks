import { Signal } from '@angular/core';

type ExtractInputsOptional<T> = {
  [K in keyof T as T[K] extends Signal<any> ? K : never]?:
  T[K] extends Signal<infer U> ? U : never;
};

export type ExtractInputs<T, K extends keyof ExtractInputsOptional<T>> =
  Omit<ExtractInputsOptional<T>, K>
  & Required<Pick<ExtractInputsOptional<T>, K>>;

