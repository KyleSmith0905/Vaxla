---
title: Home
navigation: false
---

::hero-alt

#title
[Vaxla]{class="font-mono"}

#description
Development tool to manage complex developer environments and run commands. A UI for your CLI.
::

::div{class="border rounded-lg shadow-md mt-4"}
:img{src="https://vaxla.yskkyle.com/screenshots/demo.png" height="1280" width="800" class="w-full"}
::

## What is Vaxla?

Instead of running commands in your terminal, **we provide a dashboard to run terminal commands**.

Often you would need this when developing a complex monorepo needing multiple commands to be ran in sequence or parallel. It would be useful when:
- Running a testing suite that requires multiple local services to be running.
- Developing a feature spanning across multiple microfrontends and microservices.
- Executing a script with a long name that's hard to remember.

## Features

::card-group
  ::card
  ---
  title: Easy Setup
  icon: lucide:plane-takeoff
  to: /getting-started/installation
  target: _blank
  ---
  Use on your monorepo right now with `npx @vaxla/cli start`
  ::

  ::card
  ---
  title: Simple Configuration
  icon: lucide:code-xml
  to: /getting-started/configuration
  target: _blank
  ---
  Configure your workspace in seconds with our simple configuration file.
  ::

  ::card
  ---
  title: Powerful CLI
  icon: lucide:terminal
  to: /getting-started/cli
  target: _blank
  ---
  Scripts created on Vaxla can easily be ran outside of the UI.
  ::

  ::card
  ---
  title: Share Documentation
  icon: lucide:share-2
  to: /getting-started/pages
  target: _blank
  ---
  Create and share links, articles, and documentation with your team.
  ::
::