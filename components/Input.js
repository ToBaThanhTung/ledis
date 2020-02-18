import React, { useRef, useState, useEffect, useContext } from 'react'
import { StateContext } from './LedisTerminal';
import {
  getHistoryQueue,
  findCommon,
  KEY_DOWN,
  KEY_RETURN,
  KEY_UP,
  KEY_TAB,
  MAX_COMMAND_QUEUE_LENGTH,
} from '../helpers/utils';

import { parseCommand } from '../helpers/parsers'

let historyIndex = -1;

function Input({ inputRef }) {
  const { state, setState } = useContext(StateContext);
  const commandEndRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const { timeOut } = state
  const [suggest, setSuggest] = useState('');
  const [text, setText] = useState('');

  const history = getHistoryQueue(state.history);
  const scrollToBottom = () => commandEndRef.current.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [text]);
  useEffect(() => {
    for (let key in timeOut) {
      setTimeout(() => {
        const newState = { ...stateRef.current };
        // case user use del command before key expire
        if (newState.timeOut[key])
          delete newState.timeOut[key]
        delete newState.ledis[key]
        setState(newState)
      }, timeOut[key].duration)
    }
  }, [timeOut])


  const processInput = (e) => {
    const value = e.target.value;
    if (e.target.value) {
      const matched = history.match(i => i.indexOf(value) === 0);
      const suggestText = findCommon(matched);
      setSuggest(suggestText)
    }
  }

  const onKeyDown = (e) => {
    const input = e.target.value;
    const key = e.which || e.keyCode;
    if (key === KEY_TAB) {
      if (suggest) {
        setText(suggest);
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
    }
    else if (key === KEY_UP) {
      if (historyIndex < MAX_COMMAND_QUEUE_LENGTH - 1) {
        historyIndex++;
        const previousValue = history.peek(historyIndex);
        if (previousValue)
          setText(previousValue);
      }
    }
    else if (key === KEY_DOWN) {
      if (historyIndex > 0) {
        historyIndex--;
        const previousValue = history.peek(historyIndex);
        if (previousValue)
          setText(previousValue);
      }
    }
    else if (key === KEY_RETURN) {
      if (input === "") {
        return false;
      }
      const newState = parseCommand(state, setState, input);
      history.push(input)
      setState({ ...newState, history });
      setText("");
      setSuggest("");
    }
  }

  return (
    <div id="command-line" className="flex p-2">
      <div id="prompt" className="mr-2 text-red-200">Ledis:</div>
      <div className="relative w-full text-white">
        <input
          id="command"
          className="w-full bg-transparent outline-none z-5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={processInput}
          onKeyUp={processInput}
          onKeyDown={onKeyDown}
          ref={inputRef}
          autoComplete="off"
        />
        <input id="suggest"
          className="bg-transparent text-foreground w-full z-0 absolute top-0 left-0 pointer-events-none opacity-25 z-5"
          value={suggest}
          disabled={true}
        />
      </div>
      < div ref={commandEndRef}></div>
    </div>
  )
}

export default Input
