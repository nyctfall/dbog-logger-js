/** 
 * Debugging log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
 * 
 * @param {string} file The file the logging function is being called from.
 * @param {string|string[]} trace The function location the logging function is being called from. Nested function should have a Function.name array.
 * @param {...string[]} logs The variables the logging function is outputing the values of, in the form string for variable name, variable:
 * @example dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export const dbgLog = (file: string, trace: string | string[], ...logs: Array<string | any>) => {
  try {
    console.log(
      `${"-".repeat(8)}${file}${"-".repeat(8)}\n`,
      `> ${[trace].flat(1).map(str => str.endsWith(")") ? str : `${str}()`).join(" > ")}:\n`,
      /* display the var name as: `\nVarName: ${VarValue}` */
      ...logs.map((varNameOrVal: string | any, index) => index % 2 === 1 ? 
      varNameOrVal 
      : `${(varNameOrVal as string)?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${(varNameOrVal as string)?.endsWith?.(":") ? "" : ":"}`
      )
    )
  } catch(e){
    console.error(e)
  }
}
