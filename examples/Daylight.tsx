import type { WidgetContext } from "kite";
import { Widget, VStack, HStack, Text, Image, Spacer, ProgressView, DateText } from "kite/ui";

export const config = defineScript({
  name: "Daylight",
  description: "A quiet daily dashboard with a countdown to midnight. No network needed.",
  icon: { symbol: "sun.horizon.fill", color: "#72DCC5" },
  widget: { families: ["small", "medium", "large"], refresh: "hourly" },
});

function card(ctx: WidgetContext, date: Date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(end.getDate() + 1);
  const progress = (date.getTime() - start.getTime()) / (end.getTime() - start.getTime());
  const small = ctx.family === "small";
  return (
    <Widget background="#0D1C2C">
      <VStack align="leading" spacing={small ? 7 : 10} frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "leading" }}>
        <HStack spacing={6}>
          <Image symbol="sun.horizon.fill" font="caption" color="#72DCC5" />
          <Text font="caption2" weight="semibold" color="#72DCC5">{days[date.getDay()].toUpperCase()}</Text>
          <Spacer minLength={0} />
          {!small && <Text font="caption2" color="#A5B9CA">A LITTLE ROOM FOR GOOD THINGS</Text>}
        </HStack>
        <HStack align="center" spacing={12}>
          <Text font="largeTitle" weight="heavy" design="rounded" color="#FFFFFF" lineLimit={1} minScale={0.6}>
            {months[date.getMonth()]} {date.getDate()}
          </Text>
          {!small && <Spacer minLength={0} />}
          {!small && <VStack align="trailing" spacing={3}>
            <Text font="caption2" color="#A5B9CA">LEFT TODAY</Text>
            <DateText value={end} style="timer" font="title2" color="#FFFFFF" />
          </VStack>}
        </HStack>
        <Spacer minLength={0} />
        {ctx.family === "large" && <VStack align="leading" spacing={8} padding={16} background="#172D40" cornerRadius={18} frame={{ maxWidth: "infinity", alignment: "leading" }}>
          <Text font="title2" weight="semibold" color="#FFFFFF">One small thing.</Text>
          <Text font="body" color="#BED0DE">Choose something that would make today feel well spent.</Text>
        </VStack>}
        <ProgressView value={progress} color="#72DCC5" />
        <Text font="caption2" color="#A5B9CA">{Math.floor(progress * 100)}% of today · make the rest yours</Text>
      </VStack>
    </Widget>
  );
}

export function widget(ctx: WidgetContext) {
  const now = new Date(ctx.date);
  // Fifteen-minute dated entries update the progress value without JS polling.
  // The native timer counts down live; iOS still controls timeline scheduling.
  return Array.from({ length: 9 }, (_, index) => {
    const date = new Date(now.getTime() + index * 15 * 60 * 1000);
    return { date, view: card(ctx, date) };
  });
}
