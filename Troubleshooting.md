---
layout: default
title: "Troubleshooting"
---
{% raw %}
# Troubleshooting

Use this order: save and Run in Kite → read the first error → check Preview → test
the actual widget, shortcut or control. Fix one thing at a time. Logs can contain
personal information; remove tokens and private data before sharing them.

## Compile errors

**Unexpected token / JSX parse error:** confirm the filename ends in `.tsx` or
`.jsx` when it contains tags. Check matching braces, parentheses, quotes and closing
tags. The reported position may follow the real mistake, so check the previous line.
Smart quotes pasted from prose can break JavaScript. Copy examples from code blocks.

**Invalid config / metadata error:** config is read without running source. Write
literal strings, numbers, booleans, arrays and plain objects. Don't compute a name,
spread another object into config, or call helpers there. Put logic in functions.

**Import/module/export error:** use supported `kite` and `kite/ui` imports. Node,
browser and arbitrary npm dependencies aren't available. Check spelling and export
`widget`, `shortcut`, `control` or `run`. Relative modules require their files to be
present in the library; start with one complete file when diagnosing imports.

## Runtime errors

**Undefined / cannot read property:** inspect the value before accessing a field.
A setting may be absent, storage may have no value, and a network response may not
match your assumed shape. Use defaults and validate untrusted JSON. Phone compilation
strips types; it doesn't prove that external data matches a TypeScript annotation.

**Timeout:** remove endless loops and unnecessary work. Cache requests and reduce
large inputs. Don't try to keep a script running to animate a widget. A deadline is
cooperative; it doesn't make every native call or engine built-in interruptible.

**Invalid result:** widget must return a Widget tree or dated entries containing
`date` and `view`. Don't return raw strings, Promises you forgot to await inside
data, or circular JavaScript objects. See the first-widget example.

## Requests and permissions

**Permission denied / undeclared permission:** add the relevant literal permission
in config, then Run in the app. Widgets and controls cannot present authorization
prompts. If you already denied system access, review Kite in iOS Settings. Return
safe fallback content when permission stays denied. Network declaration is required
but doesn't itself grant access to calendar, location or other protected data.

**HTTP failure:** check status with `http.fetch` and verify the URL, authentication,
service response and connectivity. Log a status or a redacted summary, not an API
key or the full private response. Cache can serve old content; shorten the cache
window while diagnosing, then restore a reasonable window. API keys belong in secrets.

**Photo blank:** load through `http.image`, pass the returned source to Image, and
provide an aspect and useful space in the layout. Run online in the app first.
Handle download failure with text or an SF Symbol. Don't assume a remote URL is a
local cached image source. Quiet Frame is a working reference.

## Widget problems

**Script absent:** Run in Kite and resolve compile errors first. Export widget and
declare the family you're adding. Pick Kite Script, not an internal benchmark widget.
Refresh the library after copying a file through Files.

**Preview works, Home Screen is stale or blank:** verify the widget's selected script
and setting slots, Run again in Kite, and wait for the system's reload. Refresh is a
hint. Preview and real widgets have different execution environments and budgets.
A prior failure can leave the last good render visible. Inspect logs/Diagnostics for
that surface before assuming your latest edit ran. Record the time, script, size,
iOS version and screenshot if the problem persists.

**Button does nothing:** pass an exported function reference to intent, not a call.
Save state with storage, return `{ reload: true }`, and render the state again.
A value held only in a module variable disappears after execution. Keep handler
parameters JSON-compatible. Test Preview and Home Screen separately.

**Lock Screen looks different:** accessory widgets use system tinting and small
layouts. Background colors and full Home Screen compositions won't transfer directly.
Test the exact accessory family and reduce content.

## Shortcuts and controls

**No shortcut output:** export shortcut(input), supply input in the Shortcuts action,
and choose the action matching text/JSON, number or file output. A console log isn't
the returned result. Check Preview output first, then Show Result in Shortcuts.

**Control missing:** export a control with kind toggle or button. Run in Kite, then
add the corresponding Kite Toggle or Kite Button and choose the script. Merely
exporting control doesn't add it to Control Center automatically.

**Control resets:** implement get() using persistent storage, and write the same
key in set(on). A control with a boolean variable at file scope loses it each run.

## Recovery without losing scripts

Copy the script file somewhere safe before large edits. Removing a Home Screen
widget doesn't fix source errors. Avoid reinstalling Kite as an initial debugging
step: local files and state may be lost. Keep a backup and use a fresh copy of the
smallest example to separate source problems from environment problems.

For a useful bug report include: the smallest script that reproduces it (secrets
removed), what you expected, what happened, family/surface, app build, iOS version,
and relevant redacted logs. Device benchmark CSV is useful for the three-day
reliability test, but isn't required for an ordinary syntax question.

{% endraw %}
