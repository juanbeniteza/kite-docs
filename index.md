---
layout: default
title: "Create scripts with Kite"
---
{% raw %}
# Create scripts with Kite

New to Kite? Read [How Kite works](How-Kite-works.html), or give your coding agent
the [agent guide](Agent-guide.html).

Start with [Your first widget](Getting-started.html). You only need Kite on your iPhone;
Xcode and a computer are not required to write scripts.

Follow [Build a daily intention widget](Progressive-tutorial.html) for five practical checkpoints.
Search [API reference](API-reference.html) for every public signature, or use
[Troubleshooting](Troubleshooting.html) when something fails.

Then use [the scripting guide](Scripting-guide.html) to add settings, saved data,
buttons, photos, Shortcuts and Control Center actions.

Ready to experiment? Copy one of these complete scripts into Kite:

| Script | What to try |
| --- | --- |
| [Daylight](examples/Daylight.tsx) | Date, progress and a native countdown. |
| [Water Garden](examples/Water%20Garden.tsx) | Persist a counter and change it with widget buttons. |
| [Quiet Frame](examples/Quiet%20Frame.tsx) | Download a photo with caching and an offline fallback. |
| [Focus Session](examples/Focus%20Session.tsx) | Start a timer from a widget or Control Center. |

The app also includes Watchlist, Habit Toggle, Next Events and Quick Note. In Scripts,
open the **+** menu and choose **Add examples** if they aren't in your library.

For precise method signatures and supported properties, use the
[API type declarations](types/index.d.ts). These describe the current
implementation. Features in the roadmap may not be available yet.

These guides cover the current Phase 1 app. Device reliability validation is still
in progress. Mac CLI/sync and Scriptable compatibility are roadmap work, not part
of these tutorials.

In builds that include offline Help, open **Help** from Settings or the editor. Help works offline. Search
finds matching sections; complete TSX examples have a **Create script from example**
action that makes an independent copy. Updates arrive with the app build.

{% endraw %}
