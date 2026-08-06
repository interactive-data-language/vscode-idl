# Accessing Embedded Python

IDL and ENVI include a Python installation. Note that you need ENVI 6.3/IDL 9.3 in order for these rules to apply.

## Managing Packages

- List installed Python packages: `PyUtils.PipList`
- Install Python package: `PyUtils.PipInstall, 'beautifulsoup4'`
- Uninstall Python package: `PyUtils.PipUninstall, 'beautifulsoup4'`

## Calling Python from IDL

Load a module and call it directly:

```idl
np = Python.Import('numpy')
arr = np.random.rand(100) ; call "rand" method
print, np.mean(arr)
print, np.std(arr, dtype='float32') ; pass keyword
```

Alternatively, run Python code as strings:

```idl
Python.Run, 'import numpy.random as ran'
Python.Run, 'arr = ran.rand(100)'
Python.Run, 'print(arr.mean())'
Python.Run, 'print(arr.std(dtype="float32"))'
```

Then access Python variables in IDL:

```idl
arr = Python.arr
```

## Accessing the Python Executable Directly

Run `PyUtils.Load` in IDL to load the default Python environment and print the folder containing `Python.exe`.

Once you have the path, you can invoke Python scripts using the embedded interpreter.

> **Note:** If you make changes to packages, IDL may need a restart to fully reinitialize Python and detect changes.
