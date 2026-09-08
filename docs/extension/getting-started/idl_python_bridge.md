# IDL-Python Bridge

This document covers some tips and tricks for how to set up the IDL-Python bridge for use with Visual Studio Code. Specifically this is in regards to calling Python from IDL (not the other way around).

If you need other guides, please let us know on GitHub!

> For IDL Workbench users, one of the things that may have been annoying is that you had no way to "restart" the IDL Python bridge without restarting the IDL Workbench.
>
> With VSCode, each session of IDL is separate, and independent from VSCode, so it is now much easier to "restart" the bridge by stopping and starting IDL again.

## Using Anaconda or Miniconda

If you use Anaconda, you'll need to make sure that VSCode is started with the desired Python environment activated and first on the path.

The easiest way to do this is with a batch file that:

1. Updates the system path
2. Optionally sets the python path
3. Activates the environment
4. Starts VSCode

::: tip
If you are Linux or Mac, you can just add the environment changes and activations command to your shell resource file (i.e. `~/.bashrc``)
:::

Here's an example Windows batch file to do just that:

```dos
@REM update system variables from root miniconda install
set PATH=C:\python_installs\Library\bin;%PATH%;
set PATH=C:\python_installs\scripts;%PATH%;
set PATH=C:\python_installs;%PATH%;
set PYTHONPATH=C:\my-python-code\python;

@REM for Windows, make sure you use call first!
call activate tf

@REM here, VSCode is on the system path
call code
```
