# Presenter Notes

Opens a 2nd window that updates when the presentations move to another slide, or steps within a slide.
This is intended for the presenter as a type of teleprompter. See [Features](#features).

## Setup

Every slide must call the `setSlide()` method on `PresenterNotesService` when an update occurs:
- Upon slide construction
- On every step change

The method requires a slide tag/name/number, and a step number. In the following example, the `ClickerService` steps are used in the slide to control animations, but also used for updating the notes service for slide `6`
```typescript
constructor() {
  const numberedStep = inject(ClickerService).makeSafeStepperSignal(2);
  const presenterNotesService = inject(PresenterNotesService);
  effect(() => presenterNotesService.setSlide(6, numberedStep()));
}
```

## Script

On the main menu, in Presentation Mode, selecting the taskbar menu "Notes" will open the presenter-notes page in a new tab. This is where the talking script is uploaded for parsing into a usable system.

The last used script is always kept in browser local storage for quick use, but new scripts can be added via copy&paste or file drop.
_Record script is not implemented_

### Script Structure

#### Tags
The hash character \# followed by some letters and a hyphen \- defines a tag.

##### \#time-10h20m30s
_(Optional)_ Default: 30m <br/>
This sets the timer to 10 hours, 20 minutes, 30 seconds. Every unit is also optional, but if the sum is 0 duration, it will revert to default.

##### \#slide-0
_(Optional)_ Default: "Error..." <br/>
Slide marker for the MainMenuComponent page.

##### \#slide-end
_(Optional)_ Default: "Error..." <br/>
Slide marker for the SlideEnd slide.

##### \#slide-x
_(Optional)_ Default: "Error..." <br/>
Slide marker for custom slide with number/name "x". This name will be emitted from [Setup](#setup). A script will typically have a custom slide tag for every slide on display.

#### Micro Step
_(Optional)_ Default: _Empty_ <br/>
Each slide has potentially multiple micro steps. These are distinct steps that change what is displayed to the audience, within the same slide.

The first micro step is simply text underneath the slide tag, while additional micro steps are prefixed with a greater-than character ">".<br/>
Example:

> #slide-1 My Intro
>
> Talking notes on initial load.
>
> \> I clicked right once, now we are on step index 1
>
> \> Another click goes to step index 2<br/>
> Extra talking notes on step index 2

## Features

When the first slide update emits (such as selecting a presentation in the main menu), the notes window will start displaying notes for the current slide while highlighting the current step.

In the top-right is a timer:
- Click on the time numbers to reset back to zero
- Click on the horizontal duration line to set a custom max time limit
- - This is graded and normalized to a 0-60 minutes range.




















