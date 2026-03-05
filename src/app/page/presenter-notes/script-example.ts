const plain = `
Tags
<ul style="margin-left: -2ch;list-style-type: square;">

<li style="background: white; display: inline;"> #slide-3 Intro </li>
<div>Start of slide numbered "3", titled "Intro"</div> 

<li style="background: white; display: inline;"> &gt; </li>
<div>Splitter between micro steps</div>

</ul>

Example (copy&paste this to make your own)
<div style="margin-left:2ch">
#slide-0 Main page

Talking points while showing the main menu, the teleprompter slide title doesn't have to match what the audience sees.

#slide-1 Intro page

Talking about how the slider number "1" MUST be numbered correctly. It defines the order, syncing the teleprompter with the slides.

> Talking point about micro step 1

> Micro step 2
And more talking context regarding the same micro step 2

> Talking line micro step 3
</div>

Tips
<div style="margin-left:2ch">
Empty lines around splitters and titles are optional, they are trimmed in the final output.
Use them if it helps to keep the source script cleaner.

Empty lines within a micro step will be shown on the teleprompter. Use this to get the best reading experience.

The slide number 0 is reserved for the main menu, going there will always trigger the teleprompter show the #slide-0 Whatever title.

Make sure slide tags are numbered correctly.
Add a micro step tag for every micro step.
</div>`;

const style = `style="
    white-space: pre-wrap; 
    font-family: monospace;
    font-size: var(--font-size-1);
    max-height: 40em;
    overflow-y: scroll;
    max-height: 40em;
    padding-right: 2ch;
    margin-right: -1ch;
"`;
const indexOfExample = plain.indexOf('Example');
const htmlMinified = plain.slice(0, indexOfExample).replaceAll('\n', '')
  + plain.slice(indexOfExample);
const htmlBreaksAdded = htmlMinified.replaceAll('\n', '<br/>');
const formatted = `<div ${style}>${htmlBreaksAdded}</div>`;

export const scriptExample = formatted;