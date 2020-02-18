import React, { useContext } from 'react'
import { StateContext } from './LedisTerminal';

function Output() {
  const { state, setState } = useContext(StateContext);
  const { outputs } = state;
  return (
    outputs.map((output, idx) =>
      <div key={idx}>
        <div id="command-line" className="flex p-2">
          <div id="prompt" className="mr-2 text-red-200 italic"><span>Ledis:</span></div>
          <div id="command" className=" bg-transparent text-blue-500 outline-none mr-1">{output.command}</div>
          <div id="args" className="bg-transparent">{output.args}</div>
        </div>
        <div id="output" className="flex p-2">
          {output.result}
        </div>
      </div>)
  )
}

export default Output
