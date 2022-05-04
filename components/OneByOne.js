import React from 'react'
import Tooltip from '@mui/material/Tooltip'

function OneByOne({ data }) {
  
  const number = (data[2] === "$_thousands") ?
    <span className="text-white font-light text-amber-500 text-3xl">$<span className="font-bold text-white">{ (data[1]/1000).toFixed(1) }k</span></span>
    :
    <span className="text-white font-bold text-3xl">{ data[1] }</span>
    
  
  return (
    <Tooltip title={data[3]} placement="top" arrow>
      <div className="p-5 m-2 rounded-lg bg-sky-800 text-center">
        
        <span className="text-sky-400">{ data[0] }</span><br />
        { number }
      </div>
    </Tooltip>
    )
  }

export default OneByOne