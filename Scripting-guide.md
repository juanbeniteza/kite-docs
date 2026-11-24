---
layout: default
title: "Scripting guide"
---
{% raw %}
# Scripting guide

[Start with a complete first widget](Getting-started.html) if you're new to Kite.
Each code block below is a separate, complete script unless described otherwise.

## How a script runs

Kite calls exported entry points for the surface you're using:

| Export | Called for | Result |
| --- | --- | --- |
| `widget(ctx)` | Widget rendering and preview | A `Widget` tree or dated timeline entries |
| `run()` | App execution for a run-only script | Work and console output |
| `shortcut(input)` | A Shortcuts action | Text, JSON, number or a supported file result |
| `control` | Control Center button or switch | `press()`, or `get()` and `set(on)` |
| Other exported functions | Widget Button/Toggle handlers | Usually `{ reload: true }` |

Run in the editor builds the script and tests its available surface; a control's
Preview has Press or switch controls. Defining a function doesn't execute its body.
For example, Focus Session starts when you press Start, not simply when you open it.

Each execution gets a fresh JavaScript context. A normal variable doesn't persist
between executions. Use `storage` for saved state shared by the same script's
app, widget and control runs. Different scripts have separate storage.

## Save data and add a button

This counter is a complete interactive widget. Tap **Add** in Preview or on the
Home Screen; the number should survive another Run.

```tsx
import { storage } from "kite";
import { Widget, VStack, Text, Button } from "kite/ui";

export const config = defineScript({
  name: "My Counter",
  widget: { families: ["small", "medium"], refresh: "daily" },
});

export async function increment() {
  await storage.update<number>("count", old => (old ?? 0) + 1);
  return { reload: true };
}

export async function widget() {
  const count = await storage.get<number>("count") ?? 0;
  return <Widget><VStack spacing={8}>
    <Text font="largeTitle" weight="bold">{count}</Text>
    <Button intent={increment} label="Add" symbol="plus.circle.fill" />
  </VStack></Widget>;
}
```

Use the exported function reference `intent={increment}`, not `increment()`.
The latter would call it while building the view. For parameters, pass a JSON
object through the Button's `params` property and accept it in your handler.
Prefer `storage.update` for counters so simultaneous actions don't overwrite
one another. `get`, `set`, `remove` and `keys` are also available. Store JSON values,
not functions or Date objects; store a date as an ISO string or timestamp.

## Layout and size

`Widget` contains `VStack`, `HStack` and `ZStack` containers. Use `Spacer`, `Divider`,
`Text`, `Image`, `DateText`, `Gauge`, `ProgressView`, `Chart`, `Button`, `Toggle`
and `Link` inside them. These render as native SwiftUI; CSS and HTML aren't supported.

Common properties include `padding`, `background`, `cornerRadius`, `opacity` and
`frame`. Text supports named fonts such as `headline`, `caption` and `largeTitle`,
plus `weight`, `color` and `lineLimit`. Sizes are in points.

Use `ctx.family` to show less content in `small` than in `large`. Home Screen
families are `small`, `medium`, `large` and iPad `extraLarge`. Lock Screen families
are `accessoryInline`, `accessoryCircular` and `accessoryRectangular`. Keep accessory
layouts simple: they use system tinting and have very little space. Choose a
supported family in `config.widget.families` and check it in Preview.

See [Daylight](examples/Daylight.tsx) for responsive layouts and progress.

## Settings and secrets

Declare settings as literal objects in `config.settings`, then read values through
`ctx.settings` in `widget`. Types are `text`, `number`, `toggle`, `enum`, `color` and
`secret`. Use defaults and validate values before calculations. The first-widget
tutorial demonstrates a text setting.

The current Home Screen widget editor has four generic setting slots. It can't
create unlimited named system fields from your source. Use Kite's script settings
for the full editor. Secret values belong in the app's secrets settings/Keychain;
read them with `await secrets.get("apiKey")` from `kite`. Don't hardcode keys in
source or log them.

`config` cannot depend on variables, function calls, spread expressions or computed
values. For instance, put `"My Widget"` directly in `config.name`, rather than a
variable containing that string. Ordinary dynamic logic belongs in functions.

## Network requests and photos

Declare `permissions: ["network"]` in `config`. Import `http` from `kite`.
`await http.json(url, { cache: "15m" })` downloads parsed JSON. With
`http.fetch`, check `response.ok` before reading `response.json()` or `text()`.
Handle errors and missing response fields so the widget still has useful content.

For images, use `await http.image(url, { cache: "1d" })`, then put the returned
source into `<Image src={source} />`. Kite downsizes images natively; don't download
full images as raw data just to resize them in JavaScript. `maxPixelSize` optionally
sets the longest edge in pixels.

[Quiet Frame](examples/Quiet%20Frame.tsx) is a complete downloadable photo widget
with a fallback. It needs internet access on the first load, but no API key.

## Permissions and native services

| Module imported from `kite` | Permission in `config.permissions` | Purpose |
| --- | --- | --- |
| `http` | `network` | Requests, JSON and cached images |
| `files` | `files` | Read/write text files |
| `calendar` | `calendar` | Read calendars and create events |
| `reminders` | `reminders` | Read, create and complete reminders |
| `location` | `location` | Coordinates and geocoding |
| `notify` | `notifications` | Schedule/cancel notifications |
| `storage`, `secrets`, `device`, `log` | No declared permission | Saved JSON, Keychain, device info and logging |

Run permission-using scripts in Kite first. Only the app can present system
permission dialogs. A declaration alone doesn't grant system access. Keep background
work brief and handle denied access. iCloud file access is app-only; local script
files use shared storage available to widgets. Never assume arbitrary filesystem
access. See [the declarations](types/index.d.ts) for each method's arguments.

## Shortcuts

Create a **Shortcuts action** starter, or paste this script:

```tsx
export const config = defineScript({ name: "Uppercase Text" });

export async function shortcut(input: unknown) {
  const text = input == null ? "" : String(input);
  return text.toUpperCase();
}
```

Run it in Kite first. In Apple's Shortcuts app, create a shortcut, search for Kite,
add its run-script action, select **Uppercase Text**, and supply text as the input.
Add Show Result after it. With input `hello`, the result should be `HELLO`.
Kite provides separate actions for general text/JSON, number and file results;
choose the one matching your return value. This example uses text/JSON. Device
validation of the full Shortcuts UI flow is still pending.

## Control Center

This is a complete persisted switch. It doesn't require a widget:

```tsx
import { storage } from "kite";
import type { Control } from "kite";

export const config = defineScript({ name: "My Switch" });

export const control: Control = {
  kind: "toggle",
  title: "My Switch",
  symbol: "bolt.fill",
  async get() { return await storage.get<boolean>("on") ?? false; },
  async set(on: boolean) {
    await storage.set("on", on);
    return { reload: true };
  },
};
```

Run it and test the switch in Preview. Then edit Control Center, add **Kite Toggle**,
and choose **My Switch** in its configuration. It saves a boolean; it doesn't
operate a light or device until you add that integration yourself.

For a momentary action, use `kind: "button"` with `async press()` and add
**Kite Button** instead. [Focus Session](examples/Focus%20Session.tsx) combines a
button control, widget and shared storage in one script.

## Dates, countdowns and refreshes

Use `ctx.date` as the rendering date. `DateText` with `style="timer"` displays a
native relative timer; it doesn't require rerunning your script every second.
Return an array of `{ date, view }` entries to schedule different views for future
times, in ascending order. Daylight and Focus Session demonstrate this.

`refresh` hints include `"15m"`, `"30m"`, `"hourly"`, `"daily"` and `"never"`.
iOS controls actual widget execution. Don't use a JavaScript loop or `setInterval`
to keep a widget alive. Timers don't extend Kite's run deadline, and a displayed
countdown alone doesn't schedule a notification or execute a function when it ends.

## Runtime boundaries

Use `kite` modules rather than browser or Node APIs: there is no DOM, React runtime,
Node filesystem or Node package loader. TypeScript annotations are stripped on the
phone; the phone doesn't perform a full TypeScript typecheck. Dynamic code such as
`eval` and `new Function` is blocked. Deadline checks are cooperative; Kite is not a
security sandbox for hostile source. Read scripts before importing them.

To debug, add `console.log("count", count)`, Run, and open Logs. Avoid logging secrets
or personal data. Keep functions small and test changes in Preview before checking
the system widget. Share the `.tsx` file, with keys removed, through Files or a link.

{% endraw %}
