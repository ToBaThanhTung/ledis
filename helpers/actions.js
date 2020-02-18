import Errors from './errors';
import nanoid from 'nanoid';

export const setCmd = (ledis, args) => {
  if (args.length !== 2) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.numOfArguments("set", 2)
    }
  }
  const [key, value] = args;
  return {
    updatedLedis: { ...ledis, [key]: value },
    result: `OK`
  }
}

export const getCmd = (ledis, args) => {
  if (args.length !== 1) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.numOfArguments("get", 1)
    }
  }
  const [key] = args;
  return {
    updatedLedis: ledis,
    result: `${ledis[key]}`
  }
}

export const clearCmd = (ledis) => {
  return {
    updatedLedis: { ...ledis }
  }
}

export const saddCmd = (ledis, args) => {
  if (args.length < 2) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.multipleArgs("sadd")
    }
  }
  const [key, ...values] = args;
  const set = ledis.hasOwnProperty(key) ? ledis[key] : new Set();
  let numOfAddedValues = 0;
  values.forEach(val => {
    if (!set.has(val)) {
      set.add(val);
      numOfAddedValues++;
    }
  })
  return {
    updatedLedis: { ...ledis, [key]: set },
    result: numOfAddedValues
  }
}

export const sremCmd = (ledis, args) => {
  if (args.length < 2) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.multipleArgs("srem", 2)
    }
  }
  const [key, ...values] = args;
  let numOfDeletedValues = 0;
  if (ledis.hasOwnProperty(key)) {
    const set = ledis[key];
    values.forEach(val => {
      if (set.has(val)) {
        set.delete(val);
        numOfDeletedValues++;
      }
    })
    return {
      updatedLedis: { ...ledis, [key]: set },
      result: numOfDeletedValues
    }
  }
  return {
    updatedLedis: { ...ledis },
    result: Errors.notFoundKey("srem")
  }
}

export const smembersCmd = (ledis, args) => {
  if (args.length !== 1) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.numOfArguments("smember", 1)
    }
  }
  const [key] = args
  if (ledis.hasOwnProperty(key)) {
    const values = Array.from(ledis[key]);
    return {
      updatedLedis: { ...ledis },
      result: `[${values.toString()}]`
    }
  }
  return {
    updatedLedis: { ...ledis },
    result: Errors.notFoundKey("smembers")
  }
}

export const sinterCmd = (ledis, args) => {
  if (args.length < 1) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.multipleArgs("sinter", 1)
    }
  }

  // validate keys
  const keys = [...args];

  for (let key of keys) {
    if (!ledis.hasOwnProperty(key)) {
      return {
        updatedLedis: { ...ledis },
        result: Errors.notFoundKey("sinter", key),
      }
    }
  }

  const intersection = (setA, setB) => {
    let _intersection = new Set()
    for (let elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem)
      }
    }
    return _intersection
  }

  const set = keys.reduce((acc, curKey) => (
    intersection(acc, ledis[curKey])
  ), ledis[keys[0]]);

  const values = Array.from(set);
  return {
    updatedLedis: { ...ledis },
    result: `[${values.toString()}]`
  }
}

export const keysCmd = (ledis, args) => {
  if (args.length) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.noArgument("keys")
    }
  }

  const listKeys = Object.keys(ledis).toString();

  return {
    updatedLedis: { ...ledis },
    result: `[${listKeys}]`
  }
}

export const delCmd = (ledis, args) => {
  if (args.length !== 1) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.numOfArguments("del", 1)
    }
  }
  const [key] = args;
  const updatedLedis = { ...ledis };
  delete updatedLedis[`${key}`]
  return {
    updatedLedis,
    result: "OK"
  }
}

export const expireCmd = (ledis, timeOut, args) => {
  if (args.length != 2) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.numOfArguments("expire", 2)
    }
  }
  const [key, seconds] = args;

  // validate seconds
  if (!Number.isInteger(parseInt(seconds)) || seconds < 0) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.wrongFormatSecond
    }
  }
  // validate key
  if (!ledis.hasOwnProperty(key)) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.notFoundKey("expire", key)
    }
  }

  const TIME = seconds * 1000;

  const updatedTimeOut = {
    ...timeOut,
    [key]: {
      start: Date.now(),
      duration: TIME
    }
  }

  return {
    updatedLedis: { ...ledis },
    updatedTimeOut,
    result: seconds
  }

}

export const ttlCmd = (ledis, timeOut = {}, args) => {
  // validate args
  if (args.length !== 1) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.numOfArguments("ttl", 1)
    }
  }
  const [key] = args;
  // validate key
  if (!ledis.hasOwnProperty(key)) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.notFoundKey("ttl", key)
    }
  }

  if (!timeOut.hasOwnProperty(key)) {
    return {
      updatedLedis: { ...ledis },
      result: Errors.notSetTimeOut
    }
  }
  const { duration, start } = timeOut[`${key}`];
  const remain = (duration - (Date.now() - start)) / 1000;

  return {
    result: remain
  }

}

const isSetType = (data) => typeof data === 'object' && data instanceof Set;


// snapshots = {
//   ids: [id, ...]
//   id: { ...state}
// }

export const saveCmd = (ledis, timeOut, args) => {

  if (args.length) {
    return {
      result: Errors.noArgument("save")
    }
  }

  const snapshots = JSON.parse(localStorage.getItem("snapshots")) || {};
  const id = nanoid();

  const ledisData = { ...ledis };
  for (let key in ledisData) {
    if (isSetType(ledisData[key])) {
      ledisData[key] = {
        type: "Set",
        data: [...ledisData[key]]
      }
    }
  }
  snapshots.hasOwnProperty("ids") ? snapshots.ids.push(id) : snapshots.ids = [id];
  snapshots.hasOwnProperty("value") ? null : snapshots.value = {}
  snapshots.value[id] = ledisData;

  localStorage.setItem("snapshots", JSON.stringify(snapshots));

  return {
    result: "OK"
  }
}

const isObjEmpty = obj => Object.entries(obj).length === 0 && obj.constructor === Object;

export const restoreCmd = (ledis, timeOut, args) => {
  if (args.length) {
    return {
      result: Errors.noArgument("restore")
    }
  }
  const snapshots = JSON.parse(localStorage.getItem("snapshots")) || {};
  if (isObjEmpty(snapshots)) {
    return {
      result: Errors.noSnapShots
    }
  }
  const lastId = snapshots.ids[snapshots.ids.length - 1];
  const preState = snapshots.value[lastId];
  const updatedLedis = {};
  for (let key in preState) {
    if (preState[key].type && preState[key].type === "Set") {
      
      updatedLedis[key] = new Set(preState[key].data)
    } else {
      updatedLedis[key] = preState[key]
    }
  }

  return {
    updatedLedis,
    result: "OK"
  }
}