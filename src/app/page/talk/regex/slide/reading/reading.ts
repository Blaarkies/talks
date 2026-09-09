import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';


@Component({
  selector: 'app-reading',
  imports: [
  ],
  templateUrl: './reading.html',
  styleUrl: './reading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Reading {

  protected text = signal(page);

}

const page = `
Find the outer frame and flags
^ — start of the string or line
$ — end of the string or line
g - global search

Break it at the main groups
^(?:\d{3}-){2}\d{4}$
start
  ( three digits followed by a hyphen ) repeated twice
  four digits
end

Find the branching logic
cat|dog
(cat|dog)s


Replace with plain language
^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$
^                 start
(?=.*[A-Z])       must contain an uppercase letter
(?=.*\d)          must contain a digit
[A-Za-z\d]{8,}    then use only letters and digits, at least 8 characters
$                 end

A regex is not read as a sentence. It is read as a set of nested rules.
  `;