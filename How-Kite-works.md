---
layout: default
title: "How Kite works"
---
{% raw %}
# How Kite works

Kite turns a small script into a native iPhone widget. You describe what to show,
where to place it, and what should happen when someone taps a button. Kite handles
turning that description into the widget you see on screen.

You can start from an example and change its words, colors and settings. You don't
need to build an iPhone app or connect your phone to a computer.

## From an idea to a widget

1. **Choose a starting point.** In Kite, create a Widget or Interactive widget.
   Give it a name, or keep the suggested one.
2. **Describe your content.** A script can show text, photos, progress, dates and
   data from a service. Its layout uses building blocks: a vertical stack puts
   items underneath each other; a horizontal stack puts them side by side.
3. **Try it in Kite.** Tap Run to see a preview. Change the layout or settings and
   Run again until it looks right. Errors and logs help you find problems.
4. **Add it to your Home Screen.** Add the Kite Script widget, choose a size, then
   select your script in Edit Widget. Each widget can have its own settings.
5. **Let iOS update it.** Kite prepares the content when the system requests an
   update. A refresh preference asks for updates; iOS chooses the actual timing.

[Create your first widget](Getting-started.html) walks through all five steps with
code you can copy. [Example scripts](index.html) give you a head start.

## What is inside a script?

Think of a script as a recipe with three parts:

- **Its label:** the name, supported sizes and options such as a message or a goal.
  In code, this is called `config`.
- **Its layout:** instructions for drawing the widget. For example, “show a title,
  a progress bar, and an Add button.” In code, this is `widget()`.
- **Its actions:** instructions to run after a tap, such as saving another glass
  of water. These are separate functions connected to the buttons.

Text that looks like `widget()` is a name used in code. A name on its own isn't a
complete script. The tutorials show complete files; the API reference describes
individual pieces you can use inside those files.

## Where do the numbers and images come from?

A widget can use text you enter in settings, data saved by a button, information
you allow it to read on your phone, or a request to an online service. Access to
things like Calendar needs your permission. Some services also need an API key;
keep keys in Kite's secrets settings, not in a file you share.

Kite starts a fresh run each time it needs to prepare content. To remember a
counter or completed habit, the script saves it in storage. A temporary variable
alone won't remember its value the next time the widget runs.

## Why doesn't everything update instantly?

A Home Screen widget isn't an app that runs continuously. iOS gives it short
opportunities to prepare its display so it can preserve battery life. It may show
saved content between updates. The preview is the quickest place to test edits.

Native countdown text can keep counting on screen without rerunning the script
every second. Buttons can run a short action and request updated content. Neither
mechanism makes a script a continuously running background process.

## More than Home Screen widgets

The same script can also provide a small Lock Screen view, an action that receives
input from Shortcuts, or a switch/button in Control Center. Those surfaces have
different sizes and behaviors, so test each one you plan to use. A script does not
add itself to any of these places automatically.

## Can an AI agent write the script?

Yes. Give your agent the [agent guide](Agent-guide.html) and describe what you want
it to show, which sizes you need, and where its data should come from. The guide
lists Kite's supported APIs and limits so the agent doesn't assume it is building
a web page. Review generated code before running it, especially if it uses private
data or online services. You can then paste its complete `.tsx` file into Kite.

{% endraw %}
