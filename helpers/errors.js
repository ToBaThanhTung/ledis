
const Errors = {
  numOfArguments: (command, num) => `wrong number of arguments, command ${command} must take ${num} value`,
  multipleArgs: (command, num) => `command ${command} must take at least ${num} value`,
  notFoundKey: (command, key = '') => `Not found key ${key}: command ${command} expect key aready definded`,
  noArgument: (command) => `command ${command} no need any args`,
  wrongFormatSecond: "second must be an positive integer",
  notSetTimeOut: "this key has not set timeout",
}

export default Errors;

