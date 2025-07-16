import React, { useState } from 'react'
import Display from './Display'
import ButtonPad from './ButtonPad'

const isOperator = (val: string) => ['+', '-', '*', '/'].includes(val)
const MAX_DISPLAY_LENGTH = 12

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState<string | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const handleButtonClick = (label: string) => {
    if (display === 'Error') {
      if (!isNaN(Number(label))) {
        setDisplay(label)
        setFirstOperand(null)
        setOperator(null)
        setWaitingForOperand(false)
        return
      } else if (label === 'C') {
        setDisplay('0')
        setFirstOperand(null)
        setOperator(null)
        setWaitingForOperand(false)
        return
      } else {
        // Ignore all other input when in Error state
        return
      }
    }
    if (!isNaN(Number(label))) {
      setDisplay(prev => {
        if (prev === '0' || waitingForOperand) return label
        if (prev.length >= MAX_DISPLAY_LENGTH) return prev
        return prev + label
      })
      setWaitingForOperand(false)
    } else if (label === '.') {
      if (!display.includes('.') && display.length < MAX_DISPLAY_LENGTH) setDisplay(prev => prev + '.')
    } else if (isOperator(label)) {
      if (operator && !waitingForOperand) {
        const result = compute(Number(firstOperand), Number(display), operator)
        setDisplay(String(result).slice(0, MAX_DISPLAY_LENGTH))
        setFirstOperand(String(result))
      } else {
        setFirstOperand(display)
      }
      setOperator(label)
      setWaitingForOperand(true)
    } else if (label === '=') {
      if (operator && firstOperand !== null) {
        const result = compute(Number(firstOperand), Number(display), operator)
        setDisplay(String(result).slice(0, MAX_DISPLAY_LENGTH))
        setFirstOperand(null)
        setOperator(null)
        setWaitingForOperand(true)
      }
    } else if (label === 'C') {
      setDisplay('0')
      setFirstOperand(null)
      setOperator(null)
      setWaitingForOperand(false)
    } else if (label === '⌫') {
      setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'))
    }
  }

  function compute(a: number, b: number, op: string) {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b === 0 ? 'Error' : a / b
      default: return b
    }
  }

  return (
    <div className="calculator-container">
      <Display value={display} />
      <ButtonPad onButtonClick={handleButtonClick} />
    </div>
  )
}

export default Calculator 