import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  viewChildren,
} from '@angular/core';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';
import { SplitSection } from '@talk/regex/common/match-split';
import { Pixelator } from '@talk/regex/component/pixelator/pixelator';

function section(content: string, highlight = false): SplitSection {
  return {
    id: content.split('').reduce((a, c) => a + c.charCodeAt(0), 0),
    type: highlight ? 'match' : undefined,
    content,
  };
}

function r(c: string): SplitSection {
  return section(c, true);
}

function t(c: string): SplitSection {
  return section(c);
}

/** @deprecated Not used in slides */
@Component({
  selector: 'app-pitfall',
  imports: [
    NgTemplateOutlet,
    Pixelator,
  ],
  templateUrl: './pitfall.html',
  styleUrl: './pitfall.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlidePitfall {

  protected pitfalls = [
    {
      problem: 'Missing anchors',
      description: [
        r('abc'),
        t('finds "abc" anywhere')],
      solution: [
        t('Add boundaries with characters or'),
        r('^'),
        r('$'),
        r('\\b')],
    },
    {
      problem: 'Case sensitive',
      description: [
        r('cat'),
        t('misses "Cat"')],
      solution: [
        t('Use'),
        r('[Cc]at'),
        t('or i flag')],
    },
    {
      problem: 'Special characters',
      description: [
        r('.nl'),
        t('matches any character, and then "nl"')],
      solution: [
        t('Escape the dot with'),
        r('\\.')],
    },
    {
      problem: 'Greedy matching',
      description: [
        r('www.*com'),
        t('matches as much as possible')],
      solution: [
        t('Use lazy matching'),
        r('www.*?com')],
    },
    {
      problem: 'Ambiguous',
      description: [
        r('\\+31[\\s\\d]*'),
        t('matches any amount of digits')],
      solution: [
        t('Try to constrain the search'),
        r('\\+31 6\\d{8}')],
    },
    {
      problem: 'Unreadable',
      description: [
        t('One gigantic pattern handling all edge cases')],
      solution: [
        t('Split into smaller separate patterns')],
    },
  ];

  private clickerService = inject(ClickerService);
  protected step = inject(ClickerService)
    .makeSafeStepperSignal(this.pitfalls.length - 1, -1);

  private pixelators = viewChildren(Pixelator);

  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(7, this.step()));

    const clickerService = inject(ClickerService);
    afterNextRender(() => clickerService.right());

    effect(() => {
      const step = this.step();
      const pixelators = this.pixelators();
      this.managePixelation(pixelators, step);
    });
  }

  private managePixelation(pixelators: ReadonlyArray<Pixelator>, step: number) {
    if (!pixelators.length) {
      return;
    }

    if (step === -1) {
      pixelators.forEach(e => {
        e.config({direction: 'out'});
        e.pixelate({immediate: true});
      });
      return;
    }

    const rStep = step * 3;
    const actives = pixelators.slice(rStep, rStep + 3);
    for (const e of actives.filter(e => e.getDirection() === 'out')) {
      e.config({direction: 'in'});
      e.pixelate();
    }

    const after = pixelators.slice(rStep + 3);
    for (const e of after.filter(e => e.getDirection() === 'in')) {
      e.config({direction: 'out'});
      e.pixelate();
    }
  }

  protected setActiveTab(index: number) {
    const difference = index - this.step();
    this.clickerService.autoStep(difference);
  }


}
