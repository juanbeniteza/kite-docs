// @kite/types — public declarations for Kite scripts.
// Every public JS API must be declared here and covered by a fixture.

/** Declares a script's static metadata. Kite reads it without running the script. */
declare function defineScript<const C extends import("kite").ScriptConfig>(config: C): C;

/** Script globals provided by Kite's runtime (no DOM or Node APIs). */
declare const console: {
  log(...values: unknown[]): void;
  info(...values: unknown[]): void;
  debug(...values: unknown[]): void;
  warn(...values: unknown[]): void;
  error(...values: unknown[]): void;
};
/** Timers run within the script's deadline; a pending timer does not extend it. */
declare function setTimeout(callback: (...args: any[]) => void, milliseconds?: number, ...args: any[]): number;
declare function clearTimeout(id: number | undefined): void;

declare namespace JSX {
  type Element = import("kite/ui").WidgetNode;
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicAttributes { key?: string | number; }
}

declare module "kite" {
  export type Family = "small" | "medium" | "large" | "extraLarge" | "accessoryCircular" | "accessoryRectangular" | "accessoryInline";
  export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
  export type Surface = "app" | "widget" | "intent" | "control" | "shortcut";
  export type Permission = "network" | "files" | "calendar" | "reminders" | "location" | "notifications";

  export type SettingDeclaration =
    | { type: "enum"; options: readonly string[]; default?: string; title?: string }
    | { type: "text"; default?: string; title?: string; placeholder?: string }
    | { type: "number"; default?: number; min?: number; max?: number; title?: string }
    | { type: "toggle"; default?: boolean; title?: string }
    | { type: "color"; default?: string; title?: string }
    | { type: "secret"; title?: string };

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

  export type SettingValues = Record<string, string | number | boolean | undefined> & { parameter?: string };

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

  export interface TimelineEntry { date: Date | string | number; view: import("kite/ui").WidgetNode; }
  export type WidgetResult = import("kite/ui").WidgetNode | TimelineEntry[];
  export interface IntentResult { reload?: boolean }

  export interface ControlToggle { kind: "toggle"; title?: string; symbol?: string; get(): boolean | Promise<boolean>; set(on: boolean): void | IntentResult | Promise<void | IntentResult>; }
  export interface ControlButton { kind: "button"; title?: string; symbol?: string; press(): void | IntentResult | Promise<void | IntentResult>; }
  export type Control = ControlToggle | ControlButton;

  export function defineScript<const C extends ScriptConfig>(config: C): C;

  // ---- http -----------------------------------------------------------------
  export interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
    headers?: Record<string, string>;
    body?: string;
    /** Serve from Kite's shared cache when fresher than this, e.g. "30s", "15m", "1h", "1d". */
    cache?: string;
    /** Seconds, default 15, max 30. */
    timeout?: number;
  }
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
  export interface ImageOptions extends Pick<RequestOptions, "headers" | "cache" | "timeout"> {
    /** Longest edge in pixels. Defaults to the widget's pixel size. Images are downscaled natively. */
    maxPixelSize?: number;
  }
  export const http: {
    fetch(url: string, options?: RequestOptions): Promise<Response>;
    json<T = any>(url: string, options?: RequestOptions): Promise<T>;
    /** Downloads and natively downscales an image. Returns a source for <Image src>. */
    image(url: string, options?: ImageOptions): Promise<string>;
  };

  // ---- storage / secrets / files -------------------------------------------------
  /** JSON values shared by this script's app runs, widgets, intents and controls. */
  export const storage: {
    get<T extends JSONValue = JSONValue>(key: string): Promise<T | undefined>;
    set(key: string, value: JSONValue): Promise<void>;
    update<T extends JSONValue = JSONValue>(key: string, fn: (value: T | undefined) => T | Promise<T>): Promise<T>;
    remove(key: string): Promise<void>;
    keys(): Promise<string[]>;
  };
  /** Keychain items private to this script. */
  export const secrets: {
    get(name: string): Promise<string | undefined>;
    set(name: string, value: string): Promise<void>;
    remove(name: string): Promise<void>;
  };
  export interface FileOptions {
    /** "local" (default, shared with widgets) or "icloud" (app only). */
    location?: "local" | "icloud";
  }
  export interface FileEntry { name: string; path: string; isDirectory: boolean; size: number; modified: string }
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

  // ---- calendar / reminders -------------------------------------------------------
  export interface CalendarInfo { id: string; title: string; color: string; allowsModifications: boolean }
  export interface CalendarEvent {
    id: string; title: string; start: Date; end: Date; isAllDay: boolean;
    location?: string; notes?: string; calendar: string; calendarColor: string;
  }
  export interface NewEvent { title: string; start: Date | string; end: Date | string; isAllDay?: boolean; location?: string; notes?: string; calendar?: string }
  export const calendar: {
    calendars(): Promise<CalendarInfo[]>;
    events(options?: { from?: Date | string; to?: Date | string; calendars?: string[]; limit?: number }): Promise<CalendarEvent[]>;
    createEvent(event: NewEvent): Promise<CalendarEvent>;
  };
  export interface Reminder { id: string; title: string; due?: Date; completed: boolean; completedAt?: Date; notes?: string; list: string; priority: number }
  export const reminders: {
    list(options?: { due?: Date | string; completed?: boolean; lists?: string[]; limit?: number }): Promise<Reminder[]>;
    create(reminder: { title: string; due?: Date | string; notes?: string; list?: string; priority?: number }): Promise<Reminder>;
    complete(id: string): Promise<void>;
  };

  // ---- location / notify / device / log -------------------------------------------
  export interface Coordinates { latitude: number; longitude: number; accuracy: number; altitude?: number; timestamp: Date }
  export interface Place { name?: string; locality?: string; region?: string; country?: string; postalCode?: string; latitude: number; longitude: number }
  export const location: {
    current(options?: { accuracy?: "best" | "tenMeters" | "hundredMeters" | "kilometer" | "threeKilometers" }): Promise<Coordinates>;
    geocode(query: string): Promise<Place[]>;
    reverse(latitude: number, longitude: number): Promise<Place[]>;
  };
  export const notify: {
    /** Returns the notification id. `action` is a URL opened when the notification is tapped. */
    schedule(options: { title: string; body?: string; at?: Date | string; action?: string; id?: string }): Promise<string>;
    cancel(id: string): Promise<void>;
  };
  export const device: {
    readonly locale: string;
    readonly colorScheme: "light" | "dark";
    readonly screen: { width: number; height: number; scale: number };
    readonly model: string;
    readonly systemVersion: string;
    battery(): Promise<{ level: number | null; state: "unknown" | "unplugged" | "charging" | "full" }>;
  };
  export const log: {
    debug(...values: unknown[]): void;
    info(...values: unknown[]): void;
    warn(...values: unknown[]): void;
    error(...values: unknown[]): void;
  };
}

declare module "kite/ui" {
  import type { JSONValue } from "kite";

  /** The JSON tree that JSX compiles to. No React runtime ships. */
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

  export function Widget(props: Container & { url?: string; background?: Color; relevance?: number }): WidgetNode;
  export function VStack(props: Container & { align?: "leading" | "center" | "trailing"; spacing?: number }): WidgetNode;
  export function HStack(props: Container & { align?: "top" | "center" | "bottom"; spacing?: number }): WidgetNode;
  export function ZStack(props: Container & { align?: Alignment }): WidgetNode;
  export function Grid(props: Container & { hSpacing?: number; vSpacing?: number; align?: Alignment }): WidgetNode;
  export function GridRow(props: Container): WidgetNode;
  export function Text(props: Modifiers & { font?: Font; color?: Color; weight?: "regular" | "medium" | "semibold" | "bold" | "heavy"; design?: "default" | "rounded" | "monospaced" | "serif"; lineLimit?: number; minScale?: number; align?: "leading" | "center" | "trailing"; children?: Child }): WidgetNode;
  export function Image(props: Modifiers & { src?: string; symbol?: string; resizable?: boolean; aspect?: "fit" | "fill"; color?: Color; font?: Font }): WidgetNode;
  /** A date that updates live without a refresh. Note: importing it as `Date` shadows the global Date in that file; prefer DateText. */
  export function Date(props: Modifiers & { value: globalThis.Date | string | number; style?: "relative" | "timer" | "time" | "date" | "offset"; font?: Font; color?: Color }): WidgetNode;
  export const DateText: typeof Date;
  export function Gauge(props: Modifiers & { value: number; range?: [number, number]; label?: string; style?: "linear" | "circular"; color?: Color }): WidgetNode;
  export function ProgressView(props: Modifiers & { value: number; total?: number; label?: string; color?: Color }): WidgetNode;
  export function Chart(props: Modifiers & { data: Record<string, JSONValue>[]; mark?: "line" | "bar" | "area" | "point"; x: string; y: string; color?: Color }): WidgetNode;
  /** Runs an exported script function in the widget extension, then reloads the widget. */
  export function Button(props: Modifiers & { intent: IntentFunction; params?: Record<string, JSONValue>; symbol?: string; label?: string; children?: Child }): WidgetNode;
  /** `isOn` comes from the script, so it survives reloads; iOS shows the new state while the intent runs. */
  export function Toggle(props: Modifiers & { isOn: boolean; intent: IntentFunction; params?: Record<string, JSONValue>; label?: string; symbol?: string; children?: Child }): WidgetNode;
  export function Link(props: Container & { url: string }): WidgetNode;
  export function Spacer(props?: Modifiers & { minLength?: number }): WidgetNode;
  export function Divider(props?: Modifiers): WidgetNode;
}
