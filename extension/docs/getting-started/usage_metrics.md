# Usage Metrics

This document covers the details that we capture about usage so that you can make the decision for yourself if you would like to opt-in or not.

> IDL for VSCode uses the VSCode root preference for telemetry (`telemetry.telemetryLevel`) as an indicator if we should send usage metrics or not.
>
> To disable reporting usage metrics for VSCode, see [here](https://code.visualstudio.com/docs/getstarted/telemetry#_disable-telemetry-reporting) for more information.

## Quick Summary

If you aren't interested in the details below, here is a high level summary of what we collect:

- No personal information

- No information about file system paths, file names, or any code you tell IDL to run

- General location information (down to the city level)

- General system information (CPUs, RAM, OS, architecture, extension version, IDL version)

- Performance information on startup (how long it takes, number of files we parse, kinds of files we parse, memory used by language server)

- Preference information (code formatting, if you use the extension themes, if you use our automated code formatter)

---

## Table of Contents

- [What are Usage Metrics?](#what-are-usage-metrics)

- [Community Transparency](#community-transparency)

- [Usage Metrics: Startup](#usage-metrics-startup)

- [Usage Metrics: Preferences](#usage-metrics-preferences)

- [Usage Metrics: IDL Version](#usage-metrics-idl-version)

- [Usage Metrics: VSCode Commands](#usage-metrics-vscode-commands)

---

## What are Usage Metrics?

Usage metrics are events that represent key details about the way that users interact with IDL for VSCode.

> IMPORTANT NOTE: No metrics contain user-specific information.
>
> We don't collect any information about filepaths, directories, or commands you type into the IDL console.

At a high level, the metrics can help us understand:

- What parts of the application and language features are being used

- General hardware specs and performance metrics to understand startup times, wait times, etc.

- Information about IDL preferences, to give us an understanding of default values and if they may need to be changed

In summary, this detail can help us make educated decisions about where we need to spend our time developing the app

---

## Community Transparency

With this source code being publicly available on GitHub, if you want to know more about how our usage metrics are gathered, you have complete access to do so.

The root logic for metric reporting is based around VSCode's API and can be found in the file `libs/vscode/shared/src/lib/vscode-telemetry-logger.ts`

Apart from seeing where the source code is located, there are three items that help make it clear what we collect:

1. All events use a helper function called `VSCodeTelemetryLogger`. If you want to see everywhere that use metrics are reported you can search this code base for `VSCodeTelemetryLogger` and see exactly what gets reported.

2. When VSCode says we can report a usage metric, we call the `SendUsageMetric` function. When this function is called, and if the Debug Mode preference is set for the extension, we log all telemetry data to the IDL Output Channel. To view the logs once Debug Mode is enabled, click the button "View Extension Logs" in the IDL sidebar.

3. The language server has a helper function called `SendUsageMetricServer` which uses a custom event with the language server protocol to send metrics to the VSCode Client. The language server does not directly send any usage metrics.

---

## Usage Metrics: Startup

When the extension activates, we capture some basic information about your instance to help us understand performance and hardware in case there are problems we need to address.

We track:

- Version of the extension

- The platform and system architecture (i.e. Windows and Inter or Mac and Arm64).

- The number of CPUs, CPU RAM, CPU RAM used by the extension, and worker threads

- Amount of time it takes the language server to startup and the rate at which it parsed files

- The number of PRO, SAVE, ENVI Task, IDL Task, and idl.json files

---

## Usage Metrics: Preferences

We track some information about your preferences in IDL to help us understand what our users like (on average) and helps inform if we need to tweak defaults or change what problems we report

Here's what we track:

- The problem codes that you have disabled

- Formatting/style preferences

- If you are using other parts of VSCode that the extension provides. This includes: if you use one of our themes, if you use our icon themes, or if you have IDL as the default formatter for PRO code

---

## Usage Metrics: IDL Version

Independent of the version of the extension, we track the version of IDL you use. This helps us know how up-to-date users are and, if we add in different capabilities requiring new versions of IDL, what risk there might be:

- The version of IDL

- If it is ENVI + IDL or just IDL

---

## Usage Metrics: VSCode Commands

> IMPORTANT NOTE: This is not the commands that you send to IDL (i.e. `print, 42`), but rather the VSCode Commands that the extension adds for IDL.
>
> We do not send events when you compile code, run files, or reset IDL.
>
> For a complete list of the commands, see the `"contributes->commands"` section of the root `package.json` file or open the command palette (Ctrl + Shift + P) and type "IDL".

When you run commands within VSCode we track the name of the command that is executed and that it was a command that ran.

This occurs when you click on items in the IDL sidebar or through the command palette and helps us to understand what tools we added are the most popular.

---
