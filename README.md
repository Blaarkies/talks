# BlaarkiesTalks

A web-based slideshow presentation platform with retro DOS/UNIX styling for dynamic, interactive technical talks

Present slides in presentation mode page, view notes on a separate monitor, or visit the interactive mode page for hands-on sandboxes where the audience can experiment with concepts of the presentation

## PWA

App uses ngsw to ensure stability in low web connection environments, such as crowded conference halls. A previous load of the website will remain in the browser, even after accidentally refreshing.

---

## Structure

- **`app/`** - Application root
  - **`bootstrap/`** - App initialization and base route configuration
  - **`common/`** - Top-level shared utilities (used across all talks)
  - **`page/`** - Main pages loaded by app
    - `main-menu/` - Talk and mode selector
    - `mode-presentation/` - Slide viewer for presenters
    - `mode-interactive/` - Audience-facing sandbox experience
    - `presenter-notes/` - Notes viewer for presenters
    - **`talk/`** - Self-contained presentations
      - `compress/*` Data Compression
      - `regex/*` - Regex Fundamentals
      - **`new-talk/`** - Example structure of a presentation
        - `common/` - Utilities scoped *only* to this talk
        - `component/` - Reusable components for this talk
        - **`route/`** - Route definitions and venue-specific configurations
          - `venue/` - `default.ts` and other venue configs
        - `sandbox/` - Interactive sandbox for audience experimentation
        - **`slide/`** - Individual slide definitions
          - `intro/` - Example of a slide
            - `nested-component/` - Sub-components for this slide
            - 
- **`style/`** - Global SCSS
  - `setup/` - Generates CSS variables based on config input

- **`../asset/`** - Web-server assets
  - **`talk/`** - Specific to each talk
    - **`new-talk/`** - Example talk. Contains .webp files used in this talk
      - **`venue/`** - Contains a directory for each venue 
        - **`new-venue/`** - Example venue. Contains .webp files used for this venue's logo, opening/closing slides, etc.

- **`../script/`** - Project scripts to simplify bulk changes
  

---

## Naming of directories/files

Avoid plural wording, entirely

Avoid repeat naming through nested directories. A component file named `x.component.ts` inside a component directory is already superfluous; remove `component` from the name

Use default exports where ambiguity is of no risk, such as route children imports

## Adding a New Talk

Create a new folder under `talk/` (e.g., `talk/my-topic/`) with the same structure: `common/`, `component/`, `slide/`, `sandbox/`, and `route/`. This keeps scoped utilities close to their use and maintains consistency.

Inspect `src/app/page/talk/regex` for examples

Mode Presentation page routes file (`src/app/page/mode-presentation/route.ts`) requires a route entry to the new talk 

Main Menu page requires UI additions to add the new talk into the selection list




---

[Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory

## CSS Variables

Run `npm update-css-vars` to generate a fresh stylesheet containing the list of potential CSS variables according to the config. See `src/style/setup`

## Host Local

Run `npm host-local` to serve the dev server on local network. View the IP in the command output, and visit that from a mobile device
