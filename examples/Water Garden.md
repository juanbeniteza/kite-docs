---
layout: default
title: "Water Garden"
---
{% raw %}
# Water Garden

[Download the TSX file](Water%20Garden.tsx) or copy the complete code below into a new Kite script. Run in Kite before adding a widget.

```tsx
import { storage } from "kite";
import type { WidgetContext } from "kite";
import { Widget, VStack, HStack, Text, Image, Button, Spacer, ProgressView } from "kite/ui";

export const config = defineScript({
  name: "Water Garden",
  description: "A daily counter with + and undo buttons. The goal is yours to choose.",
  icon: { symbol: "drop.fill", color: "#17866B" },
  widget: { families: ["small", "medium", "large"], refresh: "hourly" },
  settings: { goal: { type: "number", title: "Daily goal", default: 8, min: 1, max: 24 } },
});

function today() {
  const d = new Date();
  return `water-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function count(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(99, Math.floor(n))) : 0;
}
export async function addGlass() {
  await storage.update<number>(today(), value => Math.min(99, count(value) + 1));
  return { reload: true };
}
export async function undoGlass() {
  await storage.update<number>(today(), value => Math.max(0, count(value) - 1));
  return { reload: true };
}

export async function widget(ctx: WidgetContext) {
  const glasses = count(await storage.get<number>(today()));
  const goal = Math.max(1, Math.min(24, count(ctx.settings.goal ?? 8)));
  const small = ctx.family === "small";
  return (
    <Widget background="#EDF7EF">
      <VStack align="leading" spacing={small ? 5 : 9} frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "leading" }}>
        <HStack spacing={5}>
          <Image symbol="drop.fill" font="caption" color="#17866B" />
          <Text font="caption2" weight="bold" color="#17866B">WATER GARDEN</Text>
          <Spacer minLength={0} />
          {!small && <Text font="caption2" color="#527365">FRESH START, EVERY DAY</Text>}
        </HStack>
        <HStack align="center" spacing={6}>
          <Text font="largeTitle" weight="heavy" design="rounded" color="#153E31">{glasses}</Text>
          <Text font="title3" color="#527365">/ {goal}</Text>
          <Spacer minLength={0} />
          {!small && <Image symbol="leaf.circle.fill" font="largeTitle" color="#17866B" />}
        </HStack>
        {ctx.family === "large" && <HStack spacing={6}>
          {Array.from({ length: Math.min(goal, 10) }, (_, i) => <Image key={i} symbol={i < glasses ? "drop.fill" : "drop"} font="title3" color={i < glasses ? "#17866B" : "#A9C5B5"} />)}
        </HStack>}
        <ProgressView value={Math.min(glasses, goal)} total={goal} color="#17866B" />
        <Text font="caption2" color="#527365">{glasses >= goal ? "Your goal is complete." : "A little, often."}</Text>
        <Spacer minLength={0} />
        <HStack spacing={12}>
          <Button intent={undoGlass} symbol="minus.circle" label={small ? "" : "Undo"} foreground="#527365" />
          <Spacer minLength={0} />
          <Button intent={addGlass} symbol="plus.circle.fill" label={small ? "" : "Add"} foreground="#17866B" />
        </HStack>
      </VStack>
    </Widget>
  );
}

export async function run() {
  console.log(`${count(await storage.get<number>(today()))} glasses recorded today. Use the preview or widget buttons to change it.`);
}

```

{% endraw %}
