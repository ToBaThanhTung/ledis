
import { getCmd, setCmd, saddCmd, sremCmd, smembersCmd, sinterCmd, keysCmd, delCmd, expireCmd, ttlCmd, saveCmd, restoreCmd } from './actions';

export const parseCommand = (state, setState, input) => {
  const inputArr = input.split(" ");
  const command = inputArr[0];
  const args = inputArr.length > 1 ? inputArr.slice(1) : [];
  const argsString = args.join(" ");
  const { ledis, outputs, timeOut, } = state;

  let response = null;
  switch (command.toLowerCase()) {
    case "set":
      response = setCmd(ledis, args)
      break;
    case "get":
      response = getCmd(ledis, args)
      break;
    case "sadd":
      response = saddCmd(ledis, args)
      break;
    case "srem":
      response = sremCmd(ledis, args)
      break;
    case "smembers":
      response = smembersCmd(ledis, args)
      break;
    case "sinter":
      response = sinterCmd(ledis, args)
      break;
    case "keys":
      response = keysCmd(ledis, args);
      break;
    case "del":
      response = delCmd(ledis, args);
      break;
    case "expire":
      response = expireCmd(ledis, timeOut, args);
      break;
    case "ttl":
      response = ttlCmd(ledis, timeOut, args);
      break;
    case "save":
      response = saveCmd(ledis, timeOut, args);
      break;
    case "restore":
      response = restoreCmd(ledis, timeOut, args);
      break;
    case "clear":
      return { ledis, outputs: [] }
    default:
      response = { updatedLedis: ledis, result: "ERROR: wrong command" };
  }

  const { updatedLedis = ledis, result, updatedTimeOut = timeOut } = response;
  const newOutput = { command, args: argsString, result }
  return {
    ledis: updatedLedis,
    timeOut: updatedTimeOut,
    outputs: [...outputs, newOutput],
  }

};

