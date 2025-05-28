export const EXECUTE_IDL_FILE_DESCRIPTION = `
Executes a file of IDL code. 

This tool manages running a file of IDL code which manages starting IDL, handling different flavors of files, and returning success or not.

The code in the file should be able to be directly executed. This means that functions or procedures need to have a main level program that runs the code as users expect.

For example, if this is the code you want to run in a file:

\`\`\`idl
pro add_and_print, a, b
  compile_opt idl2
  added = a + b
  print, \`Result is $\{added}\`
end
\`\`\`

It should have a main level program added to the end that runs the procedure:

\`\`\`idl
pro add_and_print, a, b
  compile_opt idl2
  added = a + b
  print, \`Result is: $\{added}\`
end

compile_opt idl2

; run procedure
add_and_print, 1, 1

end
\`\`\`

This tool should be used whenever IDL code needs to be executed that exists in a file.`;
