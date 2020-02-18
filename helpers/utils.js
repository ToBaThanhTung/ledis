import Queue from './queue';

export const KEY_TAB = 9;
export const KEY_RETURN = 13;
export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_SLASH = 191;
export const KEY_ESC = 27;

export const MAX_COMMAND_QUEUE_LENGTH = 12;


export const getHistoryQueue = (serialized) => {
  let ret = new Queue(MAX_COMMAND_QUEUE_LENGTH);
  if (!serialized) {
    serialized = {
      store: [
        'get [key]',
        'set [key] [value]',
        'saad [key] [value1, value2,...]',
        'srem [key] [value1, value2,...]',
        'smembers [key]',
        'sinter [key1] [key2] [key3]',
        'keys',
        'delete [key]',
        'expire [key] [seconds]',
        'ttl [key]',
        'save',
        'restore'
      ],
      length: MAX_COMMAND_QUEUE_LENGTH,
    };
  }
  ret = ret.deserialize(serialized);
  return ret;
};

export const findCommon = (items) => {
  if (items && items.length) {
    const minLength = items.reduce(
      (l, i) => (l < i.length ? i.length : l),
      items[0].length,
    );
    let len = 0;
    for (len = 0; len < minLength; len++) {
      const base = items[0].charAt(len);
      let allMatched = true;
      for (let j = 1; j < items.length; j++) {
        if (items[j].charAt(len) !== base) {
          allMatched = false;
          break;
        }
      }
      if (!allMatched) {
        break;
      }
    }
    return items[0].substr(0, len);
  }
  return '';
};
