import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';
import {
  matchSplitGroup,
} from '@talk/regex/common/match-split';
import { Problem } from '@talk/regex/slide/pitfall/problem/problem';
import { PitfallSplitSection } from '@talk/regex/slide/pitfall/type';

let id = 1;
function getId({length}: string): number {
  return id+=length;
}
function section(content: string, type?: PitfallSplitSection['type'])
  : PitfallSplitSection {
  return {id: getId(content), type, content};
}

/** Wraps `c` to be styled as a regex pattern */
function r(c: string): PitfallSplitSection {
  return section(c, 'regex-display');
}

/** Wraps `c` as plain text */
function t(c: string): PitfallSplitSection {
  return section(c);
}

/** Wraps `c` as a regex result */
function e(content: string, regex: RegExp): PitfallSplitSection[] {
  return matchSplitGroup(content, regex, getId(content), 0);
}

@Component({
  selector: 'app-pitfall',
  imports: [
    Problem,
  ],
  templateUrl: './pitfall.html',
  styleUrl: './pitfall.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlidePitfall {

  protected pitfalls = [
    {
      problem: 'Missing Anchors',
      description: [
        r('name'),
        t('matches every letter sequence "name"')],
      example: e(
        'First name: Anamelia\nSurname: Boname\nStreet name: Namenstraat',
        /name/g),
      solution: [
        t('Add hints to refine the match.\n'),
        t('Add'), r('\\b'), t('boundaries.\n'),
        t('Specify the position with start/end anchors'),
        r('^'), r('$'), t('.')],
    },
    {
      problem: 'Case Sensitivity',
      description: [
        r('rose'),
        t('won\'t match the name "Rose"')],
      example: e('Rose picked a rose',
        /rose/g),
      solution: [
        t('Use a character class such as'),
        r('[Rr]ose'), t('\nwhich matches both cases of R.'),
        t('\nUse the'), r('i'), t('flag.')],
    },
    {
      problem: 'Special Characters',
      description: [
        t('Finding Netherlands website links using'), r('.nl'),
        t('\nwill match any character, followed by "nl"'),
      ],
      example: e('website unlock www.my-link.nl',
        /.nl/g),
      solution: [
        t('Escape the dot with a backslash: '), r('\\.'), t('.'),
      ],
    },
    {
      problem: 'Greedy Matching',
      description: [
        t('Quantifiers (+,*) will match the most\n'),
        t('characters that fit between the boundaries.\n'),
        r('www.*com'), t('through many links')],
      example: e(
        'Links: www.my-link-a.com, Not a link, www.my-link-b.com\n'
        + 'New line: www.my-link-c.com description of link-c',
        /www.*com/g),
      solution: [
        t('Use lazy matching'),
        r('www.*?com'), t('.')],
    },
    {
      problem: 'Stable Patterns',
      description: [
        r('[-:\\d]*'), t('matches all the digits')],
      example: e(
        `[2026-09-12 17:23:04.811] INFO
[2026-09-15 12:01:41.980] ERROR
[2026-09-19 01:31:29.049] DEBUG`,
        /[-\d]*/g),
      solution: [
        t('Constrain the search by defining limits:\n'),
        r('\\d{4}-\\d{2}-\\d{2}'),
        t('will select only the date.')],
    },
    {
      problem: 'Readability',
      description: [
        t('Gigantic regex pattern parsing logs\n'),
        r('^\[\d{4}-(\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\]\s(DEBUG|ERROR|INFO)\s+(?:.+\.\S+ - )(.+)')],
      example: matchSplitGroup(
        `[2026-09-05 09:00:32.001] DEBUG  auth.session - token refresh attempted for 8812
service restarted successfully, crash report saved to disk.
[2026-09-10 12:07:53.847] ERROR  api.gateway - upstream api timed out (retry 1/3)
[2026-09-12 15:46:14.102] INFO  api.access - "GET /api/v2/search?`,
        /^\[\d{4}-(\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\]\s(DEBUG|ERROR|INFO)\s+(?:.+\.\S+ - )(.+)/gm,
        getId({length: 99} as string), 1),
      solution: [
        t('Split into separate patterns where possible.\n'),
        t('Your future colleague will talk to you about this.')],
    },
  ];

  protected step = inject(ClickerService)
    .makeSafeStepperSignal(this.pitfalls.length - 1);

  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(7, this.step()));
  }

}
