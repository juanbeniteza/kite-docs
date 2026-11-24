---
layout: default
title: "Build a daily intention widget"
---
{% raw %}
# Build a daily intention widget

This tutorial builds one widget in five checkpoints. Start in Scripts → + → New
script → Widget. Name it Daily Intention. Replace its source with the complete file
at the end of this page, then explore each checkpoint. In the in-app guide,
**Create script from example** installs a separate editable copy.

## 1. Layout: make something visible

The final file uses a Widget with a vertical stack. The first Text is a heading;
the second displays your intention. Find `background="#172B28"` and change it to
`"#1B1530"`. Run and select small, then medium in Preview.

Expected: the same content fits both sizes and the background changes. Font names
are semantic sizes, not CSS. Keep enough contrast between text and background.

## 2. Settings: make it personal

`config.settings.intention` creates a text preference. The function reads it from
`ctx.settings.intention`. Open the script's settings in Kite and enter one small
goal. Run again.

Expected: the goal replaces “Take a short walk.” without editing code. In a real
Home Screen widget, configure that widget's settings separately. App preview
settings and system widget settings are different configurations.

## 3. Saved data: remember completion

`storage.get` loads a saved boolean. The `dayKey()` helper includes the local
calendar date, so completing today's intention doesn't mark tomorrow complete.
This file reads state only when rendered; iOS decides when the next render happens.

Run several times. Expected: Run alone doesn't mark anything complete. A module
variable would disappear between executions; storage persists for this script.

## 4. Interaction: do the work on tap

`complete()` is exported so the button can invoke it in a later execution. It saves
true, then asks for a reload. Tap Done in Preview, then Run again.

Expected: the message says Completed today. Repeated taps are safe. To try again
today, change the storage key prefix to `intention-test-` in both functions (the
shared `dayKey()` helper already handles this), or create a new copy of the script.

## 5. Home Screen: test outside the app

Run once in Kite. Add a small or medium Kite Script widget and choose Daily
Intention. Set the intention for that widget, then tap Done on the Home Screen.

Expected: the button records completion without opening an editor. If Preview
works but the Home Screen doesn't, use Troubleshooting before changing the code.
Do not treat refresh hints as exact timers.

## Complete script

```tsx
import { storage } from "kite";
import type { WidgetContext } from "kite";
import { Widget, VStack, Text, Button } from "kite/ui";

export const config = defineScript({
  name: "Daily Intention",
  icon: { symbol: "leaf.fill", color: "#72DCC5" },
  widget: { families: ["small", "medium"], refresh: "hourly" },
  settings: {
    intention: { type: "text", title: "Intention", default: "Take a short walk." },
  },
});

function dayKey() {
  const date = new Date();
  return `intention-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export async function complete() {
  await storage.set(dayKey(), true);
  return { reload: true };
}

export async function widget(ctx: WidgetContext) {
  const done = await storage.get<boolean>(dayKey()) ?? false;
  return <Widget background="#172B28"><VStack align="leading" spacing={8}>
    <Text font="caption" weight="bold" color="#72DCC5">TODAY'S INTENTION</Text>
    <Text font="headline" color="#FFFFFF" lineLimit={3}>
      {String(ctx.settings.intention ?? "Take a short walk.")}
    </Text>
    {done
      ? <Text font="caption" color="#72DCC5">Completed today</Text>
      : <Button intent={complete} label="Done" symbol="checkmark.circle.fill" />}
  </VStack></Widget>;
}
```

Next experiments: add a reset handler, display a second line only for medium, or
replace the text setting with an enum of goals. Keep config values literal and
export every interaction handler. See API reference for exact properties.

{% endraw %}
