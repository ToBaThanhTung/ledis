
const Errors = {
  wrongType: (command, type) => `ERROR: command "${command}" cannot set to key of command"${type}"`,
  numOfArguments: (command, num) => `ERROR: wrong number of arguments, command "${command}" must take "${num}" value`,
  multipleArgs: (command, num) => `ERROR: command "${command}" must take at least "${num}" value`,
  notFoundKey: (command, key = '') => `ERROR: Not found key "${key}", command "${command}" expect key aready definded`,
  noArgument: (command) => `ERROR: command "${command}" no need any args`,
  wrongFormatSecond: "ERROR: second must be an positive integer",
  notSetTimeOut: "ERROR: this key has not set timeout",
  noSnapShots: "ERROR: no snapshot has been set"
}

export default Errors;

