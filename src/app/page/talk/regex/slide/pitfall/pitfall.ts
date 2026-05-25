import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';
import { SplitSection } from '@talk/regex/common/match-split';

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

@Component({
  selector: 'app-pitfall',
  imports: [
    NgTemplateOutlet,
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

  protected setActiveTab(index: number) {
    const difference = index - this.step();
    this.clickerService.autoStep(difference);
  }

  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(7, this.step()));
  }


}
