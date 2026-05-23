import { Type } from '@angular/core';

export type FilmShot = {
  component: Type<any>
  inputs?: { content: string }
  theme?:
    | 'sepia'
    | 'paper'
}