---
layout: default
title: "API reference"
---
{% raw %}
# API reference

Generated from the current public declarations. `?` means optional; `Promise<T>`
means await the result. Import values from the module heading. Type annotations
help your editor, but the phone strips them rather than checking them.

Defaults are stated where guaranteed by declarations. Other optional rendering
properties use native renderer/system behavior; specify them when appearance matters.
All component functions return a widget node. No CSS or React runtime is involved.

# Globals

console logging and setTimeout/clearTimeout are available. Timers do not extend the run deadline. defineScript is also globally available. JSX types describe Kite nodes, not HTML.

# Module kite

## Family

See the signature for supported fields, optional values and return types.

```ts
export type Family = "small" | "medium" | "large" | "extraLarge" | "accessoryCircular" | "accessoryRectangular" | "accessoryInline";
```

## JSONValue

See the signature for supported fields, optional values and return types.

```ts
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
```

## Surface

See the signature for supported fields, optional values and return types.

```ts
export type Surface = "app" | "widget" | "intent" | "control" | "shortcut";
```

## Permission

See the signature for supported fields, optional values and return types.

```ts
export type Permission = "network" | "files" | "calendar" | "reminders" | "location" | "notifications";
```

## SettingDeclaration

See the signature for supported fields, optional values and return types.

```ts
export type SettingDeclaration =
  | { type: "enum"; options: readonly string[]; default?: string; title?: string }
  | { type: "text"; default?: string; title?: string; placeholder?: string }
  | { type: "number"; default?: number; min?: number; max?: number; title?: string }
  | { type: "toggle"; default?: boolean; title?: string }
  | { type: "color"; default?: string; title?: string }
  | { type: "secret"; title?: string };
```

## ScriptConfig

See the signature for supported fields, optional values and return types.

```ts
export interface ScriptConfig {
  name?: string;
  description?: string;
  icon?: { symbol: string; color?: string };
  widget?: {
    families?: readonly Family[];
    /** A hint for the next timeline request. iOS decides when widgets actually refresh. */
    refresh?: "never" | "15m" | "30m" | "hourly" | "daily" | number;
  };
  /** Shown natively when the user edits the widget. Secrets live in the Keychain. */
  settings?: Record<string, SettingDeclaration>;
  permissions?: readonly Permission[];
}
```

## SettingValues

See the signature for supported fields, optional values and return types.

```ts
export type SettingValues = Record<string, string | number | boolean | undefined> & { parameter?: string };
```

## WidgetContext

See the signature for supported fields, optional values and return types.

```ts
export interface WidgetContext {
  family: Family;
  settings: SettingValues;
  surface: Surface;
  /** ISO 8601 time of this run. */
  date: string;
  /** Point size of the widget, when known. */
  displaySize: { width: number; height: number };
  scriptId: string;
}
```

## TimelineEntry

See the signature for supported fields, optional values and return types.

```ts
export interface TimelineEntry { date: Date | string | number; view: import("kite/ui").WidgetNode; }
```

## WidgetResult

See the signature for supported fields, optional values and return types.

```ts
export type WidgetResult = import("kite/ui").WidgetNode | TimelineEntry[];
```

## IntentResult

See the signature for supported fields, optional values and return types.

```ts
export interface IntentResult { reload?: boolean }
```

## ControlToggle

See the signature for supported fields, optional values and return types.

```ts
export interface ControlToggle { kind: "toggle"; title?: string; symbol?: string; get(): boolean | Promise<boolean>; set(on: boolean): void | IntentResult | Promise<void | IntentResult>; }
```

## ControlButton

See the signature for supported fields, optional values and return types.

```ts
export interface ControlButton { kind: "button"; title?: string; symbol?: string; press(): void | IntentResult | Promise<void | IntentResult>; }
```

## Control

See the signature for supported fields, optional values and return types.

```ts
export type Control = ControlToggle | ControlButton;
```

## defineScript

See the signature for supported fields, optional values and return types.

```ts
export function defineScript<const C extends ScriptConfig>(config: C): C;
```

## RequestOptions

See the signature for supported fields, optional values and return types.

```ts
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
  headers?: Record<string, string>;
  body?: string;
  /** Serve from Kite's shared cache when fresher than this, e.g. "30s", "15m", "1h", "1d". */
  cache?: string;
  /** Seconds, default 15, max 30. */
  timeout?: number;
}
```

## Response

See the signature for supported fields, optional values and return types.

```ts
export interface Response {
  readonly status: number;
  readonly ok: boolean;
  readonly headers: Record<string, string>;
  readonly url: string;
  readonly fromCache: boolean;
  readonly body: string;
  text(): Promise<string>;
  json<T = any>(): Promise<T>;
}
```

## ImageOptions

See the signature for supported fields, optional values and return types.

```ts
export interface ImageOptions extends Pick<RequestOptions, "headers" | "cache" | "timeout"> {
  /** Longest edge in pixels. Defaults to the widget's pixel size. Images are downscaled natively. */
  maxPixelSize?: number;
}
```

## http

Requires network. Cache windows are strings such as "15m". Handle failed requests. Request timeout is in seconds (default 15, maximum 30). image returns a cached image source; native downscaling defaults to the widget pixel size.

```ts
export const http: {
  fetch(url: string, options?: RequestOptions): Promise<Response>;
  json<T = any>(url: string, options?: RequestOptions): Promise<T>;
  /** Downloads and natively downscales an image. Returns a source for <Image src>. */
  image(url: string, options?: ImageOptions): Promise<string>;
};
```

## storage

Per-script JSON shared across surfaces. Missing keys return undefined. Use update for counters, since it retries concurrent changes; keep its callback free of external side effects.

```ts
export const storage: {
  get<T extends JSONValue = JSONValue>(key: string): Promise<T | undefined>;
  set(key: string, value: JSONValue): Promise<void>;
  update<T extends JSONValue = JSONValue>(key: string, fn: (value: T | undefined) => T | Promise<T>): Promise<T>;
  remove(key: string): Promise<void>;
  keys(): Promise<string[]>;
};
```

## secrets

Per-script Keychain values. Missing names return undefined. Configure keys in the app; never put them in a shared source file.

```ts
export const secrets: {
  get(name: string): Promise<string | undefined>;
  set(name: string, value: string): Promise<void>;
  remove(name: string): Promise<void>;
};
```

## FileOptions

See the signature for supported fields, optional values and return types.

```ts
export interface FileOptions {
  /** "local" (default, shared with widgets) or "icloud" (app only). */
  location?: "local" | "icloud";
}
```

## FileEntry

See the signature for supported fields, optional values and return types.

```ts
export interface FileEntry { name: string; path: string; isDirectory: boolean; size: number; modified: string }
```

## files

Requires files. Paths are relative to Kite file roots. Default location is local (shared with widgets); icloud is app-only. Text methods use strings, not arbitrary binary buffers.

```ts
export const files: {
  read(path: string, options?: FileOptions): Promise<string>;
  write(path: string, text: string, options?: FileOptions): Promise<void>;
  append(path: string, text: string, options?: FileOptions): Promise<void>;
  list(path?: string, options?: FileOptions): Promise<FileEntry[]>;
  exists(path: string, options?: FileOptions): Promise<boolean>;
  remove(path: string, options?: FileOptions): Promise<void>;
  /** Path prefix for a folder bookmarked in Kite's settings, e.g. "bookmark:Notes/". */
  bookmark(name: string): Promise<string>;
};
```

## CalendarInfo

See the signature for supported fields, optional values and return types.

```ts
export interface CalendarInfo { id: string; title: string; color: string; allowsModifications: boolean }
```

## CalendarEvent

See the signature for supported fields, optional values and return types.

```ts
export interface CalendarEvent {
  id: string; title: string; start: Date; end: Date; isAllDay: boolean;
  location?: string; notes?: string; calendar: string; calendarColor: string;
}
```

## NewEvent

See the signature for supported fields, optional values and return types.

```ts
export interface NewEvent { title: string; start: Date | string; end: Date | string; isAllDay?: boolean; location?: string; notes?: string; calendar?: string }
```

## calendar

Requires calendar and system authorization granted from the app. Events use date bounds; pass explicit bounds when you need a particular day.

```ts
export const calendar: {
  calendars(): Promise<CalendarInfo[]>;
  events(options?: { from?: Date | string; to?: Date | string; calendars?: string[]; limit?: number }): Promise<CalendarEvent[]>;
  createEvent(event: NewEvent): Promise<CalendarEvent>;
};
```

## Reminder

See the signature for supported fields, optional values and return types.

```ts
export interface Reminder { id: string; title: string; due?: Date; completed: boolean; completedAt?: Date; notes?: string; list: string; priority: number }
```

## reminders

Requires reminders and system authorization. complete marks an existing reminder by id.

```ts
export const reminders: {
  list(options?: { due?: Date | string; completed?: boolean; lists?: string[]; limit?: number }): Promise<Reminder[]>;
  create(reminder: { title: string; due?: Date | string; notes?: string; list?: string; priority?: number }): Promise<Reminder>;
  complete(id: string): Promise<void>;
};
```

## Coordinates

See the signature for supported fields, optional values and return types.

```ts
export interface Coordinates { latitude: number; longitude: number; accuracy: number; altitude?: number; timestamp: Date }
```

## Place

See the signature for supported fields, optional values and return types.

```ts
export interface Place { name?: string; locality?: string; region?: string; country?: string; postalCode?: string; latitude: number; longitude: number }
```

## location

Requires location. Run in the app first for authorization; handle unavailable locations.

```ts
export const location: {
  current(options?: { accuracy?: "best" | "tenMeters" | "hundredMeters" | "kilometer" | "threeKilometers" }): Promise<Coordinates>;
  geocode(query: string): Promise<Place[]>;
  reverse(latitude: number, longitude: number): Promise<Place[]>;
};
```

## notify

Requires notifications. schedule returns an id; keep it to cancel later. action is a URL opened when the notification is tapped.

```ts
export const notify: {
  /** Returns the notification id. `action` is a URL opened when the notification is tapped. */
  schedule(options: { title: string; body?: string; at?: Date | string; action?: string; id?: string }): Promise<string>;
  cancel(id: string): Promise<void>;
};
```

## device

No declared permission. battery level can be null; handle unknown battery state.

```ts
export const device: {
  readonly locale: string;
  readonly colorScheme: "light" | "dark";
  readonly screen: { width: number; height: number; scale: number };
  readonly model: string;
  readonly systemVersion: string;
  battery(): Promise<{ level: number | null; state: "unknown" | "unplugged" | "charging" | "full" }>;
};
```

## log

No declared permission. Logs appear in Kite; console.log/info/debug/warn/error are also available. Avoid private data.

```ts
export const log: {
  debug(...values: unknown[]): void;
  info(...values: unknown[]): void;
  warn(...values: unknown[]): void;
  error(...values: unknown[]): void;
};
```

# Module kite/ui

## WidgetNode

See the signature for supported fields, optional values and return types.

```ts
export interface WidgetNode {
  type: string;
  props?: Record<string, JSONValue>;
  children?: (WidgetNode | string)[];
}
type Child = WidgetNode | string | number | boolean | null | undefined | Child[];
type Color = string;
type Length = number | "infinity";
type Alignment = "center" | "leading" | "trailing" | "top" | "bottom" | "topLeading" | "topTrailing" | "bottomLeading" | "bottomTrailing";
type Font = "largeTitle" | "title" | "title2" | "title3" | "headline" | "subheadline" | "body" | "callout" | "footnote" | "caption" | "caption2";
type IntentFunction = (params: any) => unknown;
```

## Modifiers

See the signature for supported fields, optional values and return types.

```ts
export interface Modifiers {
  padding?: number | { top?: number; leading?: number; bottom?: number; trailing?: number; horizontal?: number; vertical?: number };
  frame?: { width?: number; height?: number; minWidth?: number; maxWidth?: Length; minHeight?: number; maxHeight?: Length; alignment?: Alignment };
  background?: Color;
  cornerRadius?: number;
  opacity?: number;
  foreground?: Color;
  widgetAccentable?: boolean;
  privacySensitive?: boolean;
}
interface Container extends Modifiers { children?: Child }
```

## Widget

Root of a widget tree. url sets its open destination. Backgrounds on Lock Screen accessories are controlled by the system.

```ts
export function Widget(props: Container & { url?: string; background?: Color; relevance?: number }): WidgetNode;
```

## VStack

Vertical layout. align controls horizontal alignment; spacing is in points.

```ts
export function VStack(props: Container & { align?: "leading" | "center" | "trailing"; spacing?: number }): WidgetNode;
```

## HStack

Horizontal layout. align controls vertical alignment; spacing is in points.

```ts
export function HStack(props: Container & { align?: "top" | "center" | "bottom"; spacing?: number }): WidgetNode;
```

## ZStack

Layers children back to front. align positions them within the stack.

```ts
export function ZStack(props: Container & { align?: Alignment }): WidgetNode;
```

## Grid

Contains GridRow children. hSpacing and vSpacing control gaps in points.

```ts
export function Grid(props: Container & { hSpacing?: number; vSpacing?: number; align?: Alignment }): WidgetNode;
```

## GridRow

One row of cells inside Grid.

```ts
export function GridRow(props: Container): WidgetNode;
```

## Text

children is the displayed content. Use named fonts and hex colors. lineLimit limits wrapping; minScale permits shrinking to fit.

```ts
export function Text(props: Modifiers & { font?: Font; color?: Color; weight?: "regular" | "medium" | "semibold" | "bold" | "heavy"; design?: "default" | "rounded" | "monospaced" | "serif"; lineLimit?: number; minScale?: number; align?: "leading" | "center" | "trailing"; children?: Child }): WidgetNode;
```

## Image

Use symbol for SF Symbols or src for a cached image source. aspect controls fit/fill. Set a frame when constraining a photo.

```ts
export function Image(props: Modifiers & { src?: string; symbol?: string; resizable?: boolean; aspect?: "fit" | "fill"; color?: Color; font?: Font }): WidgetNode;
```

## Date

Native date display. Prefer importing DateText to avoid shadowing JavaScript Date. timer updates without executing the script each second.

```ts
export function Date(props: Modifiers & { value: globalThis.Date | string | number; style?: "relative" | "timer" | "time" | "date" | "offset"; font?: Font; color?: Color }): WidgetNode;
```

## DateText

Alias of the Date component, recommended to preserve access to global Date.

```ts
export const DateText: typeof Date;
```

## Gauge

Value indicator. Supply range explicitly for a known scale and choose linear/circular style.

```ts
export function Gauge(props: Modifiers & { value: number; range?: [number, number]; label?: string; style?: "linear" | "circular"; color?: Color }): WidgetNode;
```

## ProgressView

Progress indicator. Supply value and total explicitly for a known scale.

```ts
export function ProgressView(props: Modifiers & { value: number; total?: number; label?: string; color?: Color }): WidgetNode;
```

## Chart

data is an array of records; x and y name fields. Set mark explicitly for line, bar or area.

```ts
export function Chart(props: Modifiers & { data: Record<string, JSONValue>[]; mark?: "line" | "bar" | "area" | "point"; x: string; y: string; color?: Color }): WidgetNode;
```

## Button

intent must reference an exported function. params are JSON data passed to it. Use label/symbol or child content.

```ts
export function Button(props: Modifiers & { intent: IntentFunction; params?: Record<string, JSONValue>; symbol?: string; label?: string; children?: Child }): WidgetNode;
```

## Toggle

isOn is the persisted value from your script; its exported intent receives the new state. Render from saved state again after the action.

```ts
export function Toggle(props: Modifiers & { isOn: boolean; intent: IntentFunction; params?: Record<string, JSONValue>; label?: string; symbol?: string; children?: Child }): WidgetNode;
```

## Link

Wrap content in a URL destination.

```ts
export function Link(props: Container & { url: string }): WidgetNode;
```

## Spacer

Flexible empty space; minLength sets a minimum in points.

```ts
export function Spacer(props?: Modifiers & { minLength?: number }): WidgetNode;
```

## Divider

Native separator between content.

```ts
export function Divider(props?: Modifiers): WidgetNode;
```

# Native module usage examples

These are fragments to use inside an async entry point. Import the named module
from kite and declare its permission as described above. URLs are placeholders;
supply your own endpoint and validate its response.

## http example

```ts
const data = await http.json("https://example.com/data.json", { cache: "15m" });
```

## storage example

```ts
await storage.update<number>("count", old => (old ?? 0) + 1);
```

## secrets example

```ts
const token = await secrets.get("apiKey");
```

## files example

```ts
await files.append("Notes.txt", "A note\n");
```

## calendar example

```ts
const events = await calendar.events({ from: new Date(), limit: 5 });
```

## reminders example

```ts
const tasks = await reminders.list({ completed: false });
```

## location example

```ts
const coordinates = await location.current({ accuracy: "kilometer" });
```

## notify example

```ts
const id = await notify.schedule({ title: "Take a break", at: new Date(Date.now() + 60000) });
```

## device example

```ts
const battery = await device.battery();
```

## log example

```ts
log.info("Widget rendered");
```

# Component examples

These JSX fragments go inside a widget return. Import their components from kite/ui.
Button and Toggle use a placeholder exported handler: implement its persisted
state changes in your script (see the interactive tutorial). For photos, use an
Image src returned by http.image rather than symbol. GridRow is demonstrated inside Grid.

## Widget example

```jsx
<Widget background="#172B28"><Text>Hello</Text></Widget>
```

## VStack example

```jsx
<VStack align="leading" spacing={8}><Text>First</Text><Text>Second</Text></VStack>
```

## HStack example

```jsx
<HStack spacing={8}><Image symbol="sun.max.fill" /><Text>Sunny</Text></HStack>
```

## ZStack example

```jsx
<ZStack align="bottomLeading"><Text>Layer one</Text><Text>Layer two</Text></ZStack>
```

## Grid example

```jsx
<Grid hSpacing={8} vSpacing={4}><GridRow><Text>A</Text><Text>B</Text></GridRow></Grid>
```

## Text example

```jsx
<Text font="headline" weight="bold" color="#72DCC5" lineLimit={2}>Hello</Text>
```

## Image example

```jsx
<Image symbol="heart.fill" font="title" color="#FF6688" />
```

## DateText example

```jsx
<DateText value={new Date(Date.now() + 60000)} style="timer" font="title" />
```

## Gauge example

```jsx
<Gauge value={3} range={[0, 10]} style="circular" label="Steps" />
```

## ProgressView example

```jsx
<ProgressView value={3} total={8} label="Water" color="#72DCC5" />
```

## Chart example

```jsx
<Chart data={[{day: "Mon", count: 2}, {day: "Tue", count: 5}]} mark="bar" x="day" y="count" />
```

## Button example

```jsx
<Button intent={handler} params={{amount: 1}} label="Add" symbol="plus" />
```

## Toggle example

```jsx
<Toggle isOn={false} intent={handler} label="Enabled" />
```

## Link example

```jsx
<Link url="https://example.com"><Text>Open website</Text></Link>
```

## Spacer example

```jsx
<Spacer minLength={8} />
```

## Divider example

```jsx
<Divider />
```

# Shared layout types

These types explain the aliases used by component signatures. All components
accept Modifiers. Colors are strings such as hex values; lengths are points.

```ts
type Child = WidgetNode | string | number | boolean | null | undefined | Child[];
  type Color = string;
  type Length = number | "infinity";
  type Alignment = "center" | "leading" | "trailing" | "top" | "bottom" | "topLeading" | "topTrailing" | "bottomLeading" | "bottomTrailing";
  type Font = "largeTitle" | "title" | "title2" | "title3" | "headline" | "subheadline" | "body" | "callout" | "footnote" | "caption" | "caption2";
  type IntentFunction = (params: any) => unknown;

  /** Modifiers available on every component. */
  export interface Modifiers {
    padding?: number | { top?: number; leading?: number; bottom?: number; trailing?: number; horizontal?: number; vertical?: number };
    frame?: { width?: number; height?: number; minWidth?: number; maxWidth?: Length; minHeight?: number; maxHeight?: Length; alignment?: Alignment };
    background?: Color;
    cornerRadius?: number;
    opacity?: number;
    foreground?: Color;
    widgetAccentable?: boolean;
    privacySensitive?: boolean;
  }
  interface Container extends Modifiers { children?: Child }
```

{% endraw %}
