import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
} from '@angular/core';
import { PaneWindows31Component } from '@component/pane-windows-3-1/pane-windows-3-1.component';

@Component({
  selector: 'app-example-in-app',
  imports: [
    PaneWindows31Component,
    NgTemplateOutlet,
  ],
  templateUrl: './example-in-app.html',
  styleUrl: './example-in-app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleInApp {

  private self = inject(ElementRef<HTMLElement>);

  protected dragBoundaryElement = computed(() =>
    this.self.nativeElement.parentElement);

  protected windows = [
    {
      heading: 'Excel 3.1',
      src: 'talk/regex/excel.webp',
      preTranslate: '5% 2%',
      width: 600,
    },
    {
      heading: 'IntelliJ',
      src: 'talk/regex/webstorm.webp',
      preTranslate: '40% 55%',
      width: 500,
    },
  ];

}
