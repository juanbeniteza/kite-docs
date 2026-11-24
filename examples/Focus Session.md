---
layout: default
title: "Focus Session"
---
{% raw %}
# Focus Session

[Download the TSX file](Focus%20Session.tsx) or copy the complete code below into a new Kite script. Run in Kite before adding a widget.

```tsx
import { storage } from "kite";
import type { WidgetContext, Control } from "kite";
import { Widget, VStack, HStack, Text, Image, Button, Spacer, DateText } from "kite/ui";

export const config = defineScript({
  name: "Focus Session",
  description: "A 25-minute focus timer. Start/stop from the widget or start from Control Center.",
  icon: { symbol: "moon.stars.fill", color: "#C4B5FD" },
  widget: { families: ["small", "medium", "large", "accessoryRectangular"], refresh: "hourly" },
});

export async function startFocus() {
  await storage.set("focusEnd", Date.now() + 25 * 60 * 1000);
  return { reload: true };
}
export async function stopFocus() {
  await storage.remove("focusEnd");
  return { reload: true };
}

function card(ctx: WidgetContext, end: number, active: boolean) {
  const lock = ctx.family === "accessoryRectangular";
  if (lock) return <Widget><VStack align="leading" spacing={2}>
    <Text font="headline">{active ? "Focus in progress" : "Room to focus"}</Text>
    {active ? <DateText value={new Date(end)} style="timer" font="title3" /> : <Text font="caption">Start a session from Control Center.</Text>}
  </VStack></Widget>;
  return <Widget background="#1B1530"><VStack align="leading" spacing={8} frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "leading" }}>
    <HStack spacing={6}>
      <Image symbol="moon.stars.fill" font="caption" color="#C4B5FD" />
      <Text font="caption2" weight="bold" color="#C4B5FD">FOCUS SESSION</Text>
      <Spacer minLength={0} />
    </HStack>
    {active ? <DateText value={new Date(end)} style="timer" font="largeTitle" color="#FFFFFF" /> : <Text font="largeTitle" weight="heavy" design="rounded" color="#FFFFFF">25:00</Text>}
    <Text font="caption" color="#C4B5FD">{active ? "One thing at a time." : "Make room for one thing."}</Text>
    <Spacer minLength={0} />
    {ctx.family === "large" && <Text font="title2" weight="semibold" color="#FFFFFF">A small pocket of undivided attention.</Text>}
    <Button intent={active ? stopFocus : startFocus} symbol={active ? "stop.circle" : "play.circle.fill"} label={active ? "Stop" : ctx.family === "small" ? "Start" : "Start 25 min"} foreground="#C4B5FD" />
  </VStack></Widget>;
}

export async function widget(ctx: WidgetContext) {
  const saved = await storage.get<number>("focusEnd");
  const end = typeof saved === "number" && Number.isFinite(saved) ? saved : 0;
  const now = new Date(ctx.date);
  const active = end > now.getTime();
  const current = { date: now, view: card(ctx, end, active) };
  // The second entry ends the countdown display when the session finishes.
  return active ? [current, { date: new Date(end), view: card(ctx, end, false) }] : [current];
}

export const control: Control = {
  kind: "button", title: "Start focus", symbol: "moon.stars.fill",
  async press() { return startFocus(); },
};
export async function run() {
  console.log("Use Start in the preview/widget, or add Kite Button → Focus Session in Control Center.");
}

```

{% endraw %}
