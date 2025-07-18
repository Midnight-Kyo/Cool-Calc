import React, { useState, useEffect, useRef } from 'react'
import Display from './Display'
import ButtonPad from './ButtonPad'
import { evaluate } from 'mathjs'

const isOperator = (val: string) => ['+', '-', '*', '/'].includes(val)
const MAX_DISPLAY_LENGTH = 12

// Add scientific functions and constants
const scientificButtons = [
  'sin', 'cos', 'tan', 'log',
  'ln', '√', '^', '(',
  ')', 'π', 'e', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '=', 'C',
  '⌫', 'RESET'
]

const sonicColors = {
  background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
  button: 'linear-gradient(135deg, #00c3ff 0%, #ffff1c 100%)',
  accent: '#00c3ff',
  text: '#fff',
  border: '#00c3ff',
}

const Calculator: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState<string | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  // Sonic mode state
  const [sonicMode, setSonicMode] = useState(false)
  // Track input history for secret code
  const [inputHistory, setInputHistory] = useState<string[]>([])
  // Error state for Sonic mode
  const [errorState, setErrorState] = useState(false)
  const [sonicCursorPos, setSonicCursorPos] = useState<number | null>(null)
  const sonicInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light')
  }, [theme])

  useEffect(() => {
    // Move caret to sonicCursorPos if set
    if (sonicMode && sonicCursorPos !== null && sonicInputRef.current) {
      sonicInputRef.current.setSelectionRange(sonicCursorPos, sonicCursorPos)
      sonicInputRef.current.focus()
    }
  }, [display, sonicCursorPos, sonicMode])

  // --- Sonic scientific mode handler ---
  // Helper to render display with blinking cursor at sonicCursorPos
  function renderSonicDisplayWithCursor() {
    if (sonicCursorPos === null || sonicCursorPos > display.length) {
      return <><span className="display-value fade-in">{display}</span><span className="blinking-cursor">|</span></>;
    }
    return <>
      <span className="display-value fade-in">{display.slice(0, sonicCursorPos)}</span>
      <span className="blinking-cursor">|</span>
      <span className="display-value fade-in">{display.slice(sonicCursorPos)}</span>
    </>;
  }

  const handleSonicButtonClick = (label: string) => {
    if (label === 'RESET') {
      setSonicMode(false)
      setDisplay('0')
      setFirstOperand(null)
      setOperator(null)
      setWaitingForOperand(false)
      setInputHistory([])
      setErrorState(false)
      setSonicCursorPos(null)
      return
    }
    if (label === 'C') {
      setDisplay('0')
      setErrorState(false)
      setSonicCursorPos(null)
      return
    }
    if (label === '⌫') {
      setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'))
      setErrorState(false)
      setSonicCursorPos(null)
      return
    }
    if (errorState) {
      setDisplay(label === '=' ? '0' : label)
      setErrorState(false)
      setSonicCursorPos(null)
      return
    }
    if (label === '=') {
      try {
        // Replace scientific symbols with mathjs equivalents
        let expr = display
          .replace(/π/g, 'pi')
          .replace(/e/g, 'e')
          .replace(/√/g, 'sqrt')
          .replace(/\^/g, '^')
        // Add * for implicit multiplication: number before ( or function, or constant
        expr = expr.replace(/(\d)\s*([a-zA-Z(])/g, '$1*$2')
        expr = expr.replace(/(\))\s*(\d|[a-zA-Z(])/g, '$1*$2')
        // Auto-close unmatched parentheses
        const open = (expr.match(/\(/g) || []).length
        const close = (expr.match(/\)/g) || []).length
        if (open > close) {
          expr += ')'.repeat(open - close)
        }
        // Evaluate with mathjs
        let result = evaluate(expr)
        setDisplay(String(result).slice(0, MAX_DISPLAY_LENGTH))
      } catch {
        setDisplay('Error')
        setErrorState(true)
      }
      setSonicCursorPos(null)
      return
    }
    // Add space for readability and auto-parenthesis for functions
    let toAdd = label
    if (["sin","cos","tan"].includes(label)) {
      // Insert one opening and one closing parenthesis and set cursor position after the opening
      setDisplay(prev => {
        const base = prev === '0' || errorState ? '' : prev
        const newStr = base + ' ' + label + ' (  )'
        setSonicCursorPos(newStr.length - 2) // after opening (
        return newStr
      })
      return
    } else if (["log","ln","√"].includes(label)) {
      toAdd = ' ' + label + ' ( '
    } else if (["^","(",")","π","e","/","*","-","+"].includes(label)) {
      toAdd = ' ' + label + ' '
    }
    if (sonicCursorPos !== null) {
      // Insert at cursor position (inside the inner parenthesis)
      setDisplay(prev => {
        const before = prev.slice(0, sonicCursorPos)
        const after = prev.slice(sonicCursorPos)
        setSonicCursorPos(null) // move cursor to end after next input
        return before + toAdd + after
      })
    } else {
      setDisplay(prev => (prev === '0' || errorState ? label : prev + toAdd))
    }
    setSonicCursorPos(null)
    setErrorState(false)
  }

  const handleButtonClick = (label: string) => {
    // Track input history for secret code and check immediately
    setInputHistory(prev => {
      const next = [...prev, label].slice(-9); // 9 chars: 6 9 6 9 + 4 2 0 =
      if (next.join('') === '6969+420=') {
        setSonicMode(true);
      }
      return next;
    });

    if (sonicMode) return // Ignore normal input in Sonic mode

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
      }
      // Ignore all other input when in Error state
      return
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

  if (sonicMode) {
    return (
      <div className="sonic-calc-wrapper">
        <div className="calculator-container sonic-theme">
          {/* Sonic, Tails, Eggman/Robotnik icons in corners */}
          <img src="/Cool-Calc/icons8-sonic-the-hedgehog-500.svg" alt="Sonic" style={{position: 'absolute', top: '-38px', left: '-38px', height: '64px', filter: 'drop-shadow(0 0 16px #00c3ff)'}} />
          <img src="/Cool-Calc/icons8-tails-prower-480.svg" alt="Tails" style={{position: 'absolute', top: '-38px', right: '-38px', height: '64px', filter: 'drop-shadow(0 0 16px #ffb300)'}} />
          <img src="/Cool-Calc/icons8-eggman-robotnik-480.svg" alt="Eggman" style={{position: 'absolute', bottom: '-38px', left: '-38px', height: '64px', filter: 'drop-shadow(0 0 16px #ff004c)'}} />
          <h2 style={{
            color: '#fff700',
            fontFamily: 'Orbitron, sans-serif',
            letterSpacing: '0.08em',
            textShadow: '0 0 12px #fff700, 0 0 24px #ffb300, 2px 2px 0 #001f3f',
            background: 'transparent',
            marginBottom: '0.7em',
          }}>SONIC SCIENTIFIC MODE!</h2>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <div className="calculator-display sonic-display">
              <span className="display-flex">
                {renderSonicDisplayWithCursor()}
              </span>
            </div>
            <div className="button-pad-grid sonic-grid">
              {scientificButtons.map((label, idx) => (
                <button
                  key={idx}
                  className="calc-btn sonic-btn"
                  style={{
                    background: label === 'RESET' ? 'linear-gradient(135deg, #ff004c 60%, #00c3ff 100%)' : sonicColors.button,
                    color: label === 'RESET' ? '#fff' : sonicColors.text,
                    border: `2px solid ${sonicColors.accent}`,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: '0.7rem',
                    boxShadow: '0 0 12px #00c3ff, 0 0 4px #fff',
                    cursor: 'pointer',
                    outline: 'none',
                    margin: '0.1rem',
                    transition: 'all 0.2s',
                    minWidth: 0,
                    minHeight: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  onClick={() => handleSonicButtonClick(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="calculator-container">
      <button
        className="theme-toggle-btn hide-on-mobile"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? '🌙 Neon Dark' : '🌞 Neon Light'}
      </button>
      <Display value={display} />
      <ButtonPad onButtonClick={handleButtonClick} />
    </div>
  )
}

export default Calculator 