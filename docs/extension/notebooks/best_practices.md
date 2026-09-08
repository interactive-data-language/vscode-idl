# Notebooks: Best Practices and Tips

When you create notebooks, we have a few tips for how to use them:

1. Logic and comments should flow from the top of the notebook file to the bottom

2. Don't use variables, or routine definitions, from later in the notebook file

3. Be aware of how many graphics are embedded in a notebook.

   Anytime you run a cell that embeds a graphic, then save, that graphic is added into your notebook file.

4. Try to avoid creating routine definitions in cells if you can, but it's not the end of the world if you do.

5. Notebook cells are executed in the same folder as the notebook. This means you can use code like `routine_filepath()` to get the folder for the notebook cell.

6. All notebook cells are executed using `compile_opt idl2` to change the data type and force brackets for array indexing

7. At this time, debugging is not supported in notebooks.
