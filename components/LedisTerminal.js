import React, { useState, useRef, useEffect, createContext } from 'react'
import Output from './Output';
import Input from './Input';

export const StateContext = createContext(null);

const getInitialState = () => {
  return {
    outputs: [],
    ledis: {},
    timeOut: {}
  }
}

const LedisTerminal = () => {
  const [state, setState] = useState(getInitialState());
  const inputRef = useRef();

  const onFocusInput = () => inputRef.current.focus()

  useEffect(onFocusInput, [])


  return (
    <StateContext.Provider value={{ state, setState }}>
      <div id="terminal" className="md:w-1/2 sm:w-full rounded-md text-white h-screen md:h-80 shadow-lg"
        onClick={onFocusInput}
      >
        <div id="terminal-head" className="bg-gray-400 rounded-t-md w-full h-8 flex justify-between items-center italic text-gray-700 px-2">
          <div className="flex justify-start">
            <span className="w-4 h-4 mr-1">
              <img src="/icons/close.png"></img>

            </span>
            <span className="w-4 h-4 mr-1">
              <img src="/icons/fullscreen.png"></img>
            </span>
            <span className="w-4 h-4 mr-1">
              <img src="/icons/minimize.png"></img>

            </span>
          </div>
          <div>
            <a>Holistic/Ledis</a>
          </div>
          <div className="w-15"></div>
        </div>
        <div id="terminal-body" className="font-sans rounded-b-md bg-gray-900 overflow-auto h-body md:h-76">
          <Output />
          <Input inputRef={inputRef} />
        </div>
      </div>
    </StateContext.Provider>
  )
}

export default LedisTerminal