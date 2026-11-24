import { http } from "kite";
import type { WidgetContext } from "kite";
import { Widget, ZStack, VStack, Text, Image } from "kite/ui";

export const config = defineScript({
  name: "Quiet Frame",
  description: "A landscape photo card. Uses Kite's native image downscaling and a one-day cache.",
  icon: { symbol: "photo.on.rectangle.angled", color: "#B1DAC6" },
  widget: { families: ["small", "medium", "large"], refresh: "hourly" },
  settings: { caption: { type: "text", title: "Caption", default: "Take the scenic route." } },
  permissions: ["network"],
});

export async function widget(ctx: WidgetContext) {
  const width = Math.max(80, (ctx.displaySize?.width || 338) - 32);
  const height = Math.max(80, (ctx.displaySize?.height || 158) - 32);
  try {
    // Use http.image, rather than putting the remote URL directly into <Image>.
    // Kite downloads and downsizes it natively for the current widget dimensions.
    const photo = await http.image("https://picsum.photos/id/10/1200/900", { cache: "1d" });
    return <Widget background="#10251E">
      <ZStack align="bottomLeading" frame={{ width, height }} cornerRadius={18}>
        <Image src={photo} resizable aspect="fill" frame={{ width, height }} />
        <VStack align="leading" spacing={3} padding={10} background="#10251E" opacity={0.94} frame={{ maxWidth: "infinity", alignment: "leading" }}>
          <Text font="caption2" weight="bold" color="#B1DAC6">PAUSE &amp; LOOK</Text>
          <Text font="headline" color="#FFFFFF" lineLimit={1} minScale={0.7}>{String(ctx.settings.caption || "Take the scenic route.")}</Text>
        </VStack>
      </ZStack>
    </Widget>;
  } catch (error) {
    console.warn("Quiet Frame:", String(error));
    return <Widget background="#10251E"><VStack spacing={8}>
      <Image symbol="photo" font="largeTitle" color="#B1DAC6" />
      <Text font="headline" color="#FFFFFF">A quiet moment.</Text>
      <Text font="caption" color="#B1DAC6">Run in Kite with internet access to load the photo.</Text>
    </VStack></Widget>;
  }
}
