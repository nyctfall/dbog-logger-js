/**
 * @file A bunch of types and helpers for logging.
 */


/** 
 * Debugging log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
 * 
 * @prop {@link FileLoggerFactory} fileLogger Returns a function that calls the debug logger with a preset file name for all invokations.
 * @param file The file the logging function is being called from.
 * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
 * @param logs The variables the logging function is outputing the values of. 
 * @example 
 * // in the form: ("string for variable name", variable):
 * dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
const dbgLog: Logger = (file: string, trace: string | string[], ...logs: Array<string | any>) => {
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

/** 
 * Helper for the debugging log helper, returns a function that calls the debug logger with a preset file name for all invokations.
 * 
 * @param file The file the logging function is being called from.
 * @returns {@link FileLogger} The function the will have a preset file, other args same as dbgLog.
 * @example 
 * const log = dbgLog.fileLogger(file)
 * log(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export const dbgFileLogger: FileLoggerFactory = (file: string) => {
  const fileFn = (...args: [trace: string | string[], ...logs: Array<string | any>]) => dbgLog(file, ...args)

  /** @readonly */
  fileFn.file = file
  
  /** 
   * Helper for the file debug log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
   * 
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @returns {@link StackLogger} The debug logger function with a preset stack trace value.
   * @example 
   * const fileLogger = dbgLog.fileLogger(file)
   * const log = fileLogger.stackLogger(trace)
   * log("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  fileFn.stackLogger = (trace: string | string[]) => {
    const stackFn = (...logs: Array<string | any>) => fileFn(trace, ...logs)
    
    /** @readonly */
    stackFn.file = fileFn.file
    
    /** @readonly */
    stackFn.trace = trace
    
    
    return stackFn
  }
  
  
  return fileFn
}

export type LogFn = (file: string, trace: string | string[], ...logs: Array<string | any>) => void
export type FileLogFn = (trace: string | string[], ...logs: Array<string | any>) => void
export type StackLogFn = (...logs: Array<string | any>) => void

export type Logger = LogFn & LoggerProps
export type FileLogger = FileLogFn & FileLoggerProps
export type StackLogger = StackLogFn & StackLoggerProps

export type FileLoggerFactory = (file: string) => FileLogger
export type StackLoggerFactory = (trace: string | string[]) => StackLogger

export interface LoggerProps extends Function {
  fileLogger: FileLoggerFactory
}  

export interface FileLoggerProps extends Function {
  stackLogger: StackLoggerFactory
  file?: string
}  

export interface StackLoggerProps extends Function {
  file: string
  trace: string | string[]
}

dbgLog.fileLogger = dbgFileLogger

export { dbgLog }
