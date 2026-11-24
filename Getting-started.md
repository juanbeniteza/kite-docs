---
layout: default
title: "Your first widget"
---
{% raw %}
# Your first widget

We'll make a small widget that shows a message, change its appearance, and put it
on your Home Screen. No web service or API key is needed.

## 1. Create a script

In Kite, go to **Scripts → + → New script**. Choose **Widget**, name it
**Hello Kite**, and tap **Create**. Leaving the name empty also works: Kite uses a
default name.

The other starters are useful later: **Interactive widget** adds working buttons,
**Shortcuts action** processes input, and **Control** creates a Control Center
switch or button. A script can support several of these surfaces at once.

## 2. Replace the code

Select the existing code in the editor and paste this whole example:

```tsx
import type { WidgetContext } from "kite";
import { Widget, VStack, Text, Image } from "kite/ui";

export const config = defineScript({
  name: "Hello Kite",
  icon: { symbol: "sun.max.fill", color: "#72DCC5" },
  widget: { families: ["small", "medium"], refresh: "hourly" },
  settings: {
    message: { type: "text", title: "Message", default: "Made on my iPhone." },
  },
});

export async function widget(ctx: WidgetContext) {
  return (
    <Widget background="#0D1C2C">
      <VStack align="leading" spacing={8}>
        <Image symbol="sun.max.fill" font="title2" color="#72DCC5" />
        <Text font="headline" color="#FFFFFF">Hello, Kite</Text>
        <Text font="caption" color="#72DCC5">
          {String(ctx.settings.message ?? "Made on my iPhone.")}
        </Text>
      </VStack>
    </Widget>
  );
}
```

This is TypeScript with JSX, saved as a `.tsx` file. JSX is the tag-shaped part of
the code, such as `<Text>`. It describes the widget layout; it isn't HTML.
You don't need React or a build step. Kite compiles the file on your phone.

## 3. Run it

Tap **Run**. While editing, Run is available in the row above the keyboard; the
keyboard button dismisses it. With the keyboard hidden, Run is at the bottom.
Kite saves the latest code before running it.

You should see a dark widget with a mint sun and your message in **Preview**.
Try the small and medium preview sizes. **Logs** shows messages from `console.log`.
If compilation fails, Kite stays in **Code** and shows the error and line number.

Change `Hello, Kite` to your own heading, then Run again. Change `#0D1C2C` to
`#243B35` to change the background. Keep the quotation marks around both values.

## 4. Understand the pieces

- `import` brings in the Kite components and types used by this file.
- `config` describes the script: its name, sizes and settings. Kite reads this
  without executing the script. Keep it a plain object of literal values.
- `widget(ctx)` builds the view. `ctx` contains the selected size, settings and date.
- `Widget` is the root. `VStack` arranges children vertically; `HStack` is horizontal.
- `Text` draws text, and `Image symbol` draws an SF Symbol.
- `{...}` inside JSX evaluates a JavaScript expression.

Changing `config.icon` changes the script's library icon. The widget's sun comes
from the separate `<Image>` line.

## 5. Change a setting

Open the editor's settings button and change **Message**. Run again to see it.
Settings let you customize a script without editing the source every time.

## 6. Add it to the Home Screen

1. Touch and hold an empty area of the Home Screen and open the widget picker.
2. Find Kite and add **Kite Script** in small or medium size.
3. Touch and hold the new widget, choose **Edit Widget**, and choose **Hello Kite**.
4. Set its options if offered, then close the editor.

Kite must compile your script in the app first. After changing code, open Kite and
Run again before checking the Home Screen. iOS schedules widget updates;
`refresh: "hourly"` is a request, not an exact hourly timer.

## Import a complete script instead

Open a linked `.tsx` example from [the docs index](index.html), copy all its code,
create a script in Kite and replace the starter's contents. Keep the whole file,
including imports and `config`.

You can also copy a `.tsx` file into the folder shown under **Kite → Settings →
Script library**, then refresh Scripts. Use that displayed location: it may be
in iCloud Drive or in the local Files app folder. Never put API keys in shared files.

## If something goes wrong

| What you see | What to check |
| --- | --- |
| Red error with a line number | Check that line for missing brackets, commas or quotes. Copy the complete example again if needed. |
| A JSX parsing error | Make sure the file uses `.tsx` or `.jsx`, not plain `.ts`. |
| Script missing from the widget picker | Open Kite and Run first; check that `widget` is exported and the chosen size is in `config.widget.families`. |
| Run succeeds but nothing visible changes | `run()` may only log. A widget needs `widget()`; changing data may require a button press. Check Logs and Preview. |
| Old Home Screen content | Run in Kite, check widget configuration, then allow iOS to request its update. Preview is the fastest edit/test loop. |
| Permission failure | Declare the permission in `config`, then run in Kite to grant any required system access. Widgets cannot show permission prompts. |

Next: [save data, add buttons and use native APIs](Scripting-guide.html).

{% endraw %}
