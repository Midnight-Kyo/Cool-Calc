import React from 'react'

type DisplayProps = { value: string }

const Display: React.FC<DisplayProps> = ({ value }) => (
  <div className="calculator-display">
    <span className="display-flex">
      <span className="display-value fade-in">{value}</span>
      <span className="blinking-cursor">|</span>
    </span>
  </div>
)

export default Display 