# Problem Codes: Configuration

Each problem code can be manually disabled if desired.

::: tip
Any problems you disable do not require a restart of Visual Studio Code. The reported problems should update fairly quickly and disappear from the UI.
:::

[[toc]]

## Disable Reporting of All Problems

For legacy code bases, or if you don't like that problems are being reported, you have the option to disable them being reported altogether.

Do note that this does **not** disable the static analysis of your code; it simply means any issues are not reported to the VSCode UI. This is because we still need to parse and analyze your code to provide hover help and auto complete.

::: warning
Reported problems help make sure your IDL code is consistent and error free before you compile or run your programs.

We understand that expert users might find the issues we report to be annoying, so we provided this master switch to disable the capability.

If the reported problems don't help, or they are false errors, let us know and we are happy to fix any issues to improve the user experience.
:::

To disable reporting issues:

1. Navigate to the IDL Sidebar

2. Near the bottom of the sidebar, select "Open Extension Settings"

3. Select the group "Problem Reporting"

4. Turn off "Report Problems"

## Disable Problems within a Single File

See [here](./disabling_with_comments.md) for our IDL comment API for disabling problem reporting.

## Disable All Documentation Errors

Because documentation errors represent many problem codes, you can turn them all off with a single setting.

To do this:

1. Navigate to the IDL Sidebar

2. Near the bottom of the sidebar, select "Open Extension Settings"

3. Select the group "Problem Reporting"

4. Turn off "Report Docs Problems"

## Disable Single Codes

To disable a problem code:

1. Navigate to the IDL Sidebar

2. Near the bottom of the sidebar, select "Open Extension Settings"

3. Select the group "Problem Reporting"

4. Add new entries to "Ignore Problems" for each problem code that you want disabled

## Disable via Code Actions

If you click into any problem in your code, a light bulb will appear that gives you actions to fix/resolve errors.

You have several options to disable problems:

1. Disable problem for workspace, which applies to the current workspace that you have open.

2. Disable problem for user, which applies to your global settings

::: warning
Be careful mixing and matching problem code configurations between user and workspace settings.

Once you add problem codes to the workspace settings, user settings are completely ignored.

If you get into a weird state, you may need to remove the ignored problems from your workspace and/or user settings and start fresh.
:::
