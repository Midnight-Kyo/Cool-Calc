import React from 'react'
import Button from './Button'

type ButtonPadProps = {
  onButtonClick: (label: string) => void
}

const buttons = [
  '7','8','9','/',
  '4','5','6','*',
  '1','2','3','-',
  '0','.','=','+',
  'C','⌫','',''
]

const ButtonPad: React.FC<ButtonPadProps> = ({ onButtonClick }) => (
  <div className="button-pad-grid">
    {buttons.map((label, idx) => (
      label ? <Button key={idx} label={label} onClick={() => onButtonClick(label)} /> : <span key={idx} />
    ))}
  </div>
)

export default ButtonPad 