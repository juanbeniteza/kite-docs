---
layout: default
title: "Point your agent here"
---
{% raw %}
# Point your agent here

Use this guide when asking an AI coding agent to create a Kite script. No access
to the private app repository is needed. The documentation describes the current
implementation; roadmap ideas are not available APIs.

## Give your agent this instruction

Copy this instruction and append your widget idea:

```text
Read https://juanbeniteza.github.io/kite-docs/llms-full.txt before writing code.
Create a Kite script using only the documented APIs and runtime capabilities.
Return one complete .tsx file, including config, imports and exported entry points.
Explain required permissions/secrets, supported sizes, installation and test steps.
State limitations honestly; do not invent APIs or promise exact background refreshes.
My idea: ...
```

If the agent cannot open URLs, download the plain-text guide and attach it to the
conversation. A link does not automatically give every agent browsing capability.

## Read these sources

- [How Kite works](How-Kite-works.html): a plain-language explanation for the user.
- [API reference](API-reference.html): supported arguments, properties and return types.
- [Type declarations](types/index.d.ts): the exact public contract.
- [Scripting guide](Scripting-guide.html): entry points and native services.
- [Daily Intention tutorial](Progressive-tutorial.html): a complete interactive script.
- [Water Garden](examples/Water%20Garden.tsx): persisted widget actions.
- [Quiet Frame](examples/Quiet%20Frame.tsx): native cached image loading and fallback.
- [Focus Session](examples/Focus%20Session.tsx): timelines, timer and control.

## Execution and output contract

- Deliver a single self-contained `.tsx` file by default. JavaScript/JSX is also
  supported, but TypeScript with JSX is the easiest shared format for examples.
- Use imports from `kite` and `kite/ui`. JSX creates native widget nodes; it is not
  React, HTML, CSS or a browser page. No React state/hooks, DOM, Node filesystem,
  npm package runtime, browser `fetch`, `setInterval`, or dynamic `eval`/`Function`.
  Use `http` for requests. Do not invent browser APIs from habit.
- Export `config = defineScript({...})` with a literal object. Metadata is parsed
  without executing the script. No computed fields, helper calls, spreads or
  variables inside config. Dynamic logic belongs in exported functions/helpers.
- `widget(ctx)` returns a Widget root or ascending `{ date, view }` timeline entries.
  `run()` handles app-only work/logging. `shortcut(input)` returns action output.
  `control` supplies button `press()` or toggle `get()`/`set(on)`.
- Every run starts with fresh JavaScript state. Persist JSON with `storage` and
  use `storage.update` for concurrent counters. Its callback can be retried: keep
  external side effects outside it. Dates should be saved as strings/timestamps.
- Buttons use `intent={exportedFunction}`, not a function call or inline closure.
  `params` is a JSON object passed to the handler. Widget Toggle adds `isOn` to
  that object: its handler receives `{ isOn, ...params }`. This differs from a
  Control Center toggle's `set(on)`, which receives a boolean directly.
- After a state change, return `{ reload: true }` and render the saved state again.
  Do not claim that changing a local variable updates a widget.

## Layout and system limits

- Use only the components/properties in the type declarations. Supported content
  includes stacks, grids, Text, Image, DateText, Gauge, ProgressView, Chart, Button,
  Toggle, Link, Spacer and Divider. No arbitrary HTML tags, CSS classes, web fonts,
  pixel font sizes or gradients unless an API explicitly documents them.
- Use named fonts and point-based frames. Keep layouts compact and check every
  declared family. Home Screen: small/medium/large, plus iPad extraLarge. Lock
  Screen: accessoryInline/accessoryCircular/accessoryRectangular with system
  tinting and restricted space. Don't promise a full-color Home Screen design on
  an accessory surface. Do not promise buttons in every accessory family.
- `ctx.date` is the rendering date; `ctx.displaySize` is in points, not pixels.
  Use `DateText` rather than importing `Date` and shadowing JavaScript's Date.
- iOS schedules widget runs. `refresh` is a hint, not a guaranteed interval.
  Timelines schedule display entries; they don't execute arbitrary code later.
  A native timer doesn't itself schedule notifications or trigger an action at zero.
- Keep work brief. The current normal deadline is 10 seconds with cooperative
  checks; native calls/engine built-ins aren't always interruptible. Don't add
  background loops or claim a measured memory budget that isn't documented.
- Phone compilation strips TS/JSX; it does not perform full TypeScript checking.
  Validate settings, missing storage and remote JSON at runtime. Gracefully handle
  permission denial, network failures and empty datasets.

## Native access and data

- Declare only needed permissions: network, files, calendar, reminders, location,
  notifications. Run in the app first for any required system prompts. Extensions
  cannot prompt for access. Declaration alone doesn't grant authorization.
- `storage`, `secrets`, `device` and `log` need no config permission. Secrets are
  per-script Keychain values: use `secrets.get`, not hardcoded tokens or logs.
- Use `http.image` for photos, then its returned source in Image. Native decoding
  downsizes the image; use caching and a useful offline view. Don't implement
  full-resolution image processing in JS.
- Use Kite's files API within its roots. Local files are shared with widget runs;
  iCloud file access is app-only. Do not assume arbitrary device filesystem access.
- Widget editor settings currently have four generic slots. App script settings
  expose the fuller configuration. Don't promise dynamically generated unlimited
  named system parameters or automatic placement of widgets/controls.
- Scriptable compatibility and Mac CLI/sync are roadmap work. Don't generate
  Scriptable globals, ListWidget or CLI commands as though already supported.
- Kite is for trusted scripts, not a sandbox for hostile source. Explain external
  service calls and sensitive data use. Don't embed credentials in shared output.

## Agent handoff checklist

Before handing over a script, check imports, literal config, complete exported
entry points, family layouts, persistent state, exported interaction references,
permissions and failure fallbacks. Separate APIs you verified from assumptions.
If a service contract is unknown, ask for it or clearly mark a placeholder URL;
never fabricate a working endpoint or claim testing you haven't performed.

Return installation steps: create a script, paste the complete file, Run in Kite,
configure any settings/secrets, check Preview/Logs, then add and configure Kite
Script, the Shortcuts action or the matching Kite control. Include expected output
and a repeatable tap/run test. Label preview/compiler checks separately from
physical-device checks. Don't require reinstalling the app for a script edit.

{% endraw %}
