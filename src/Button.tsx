import React from 'react'

type ButtonProps = { label: string, onClick?: () => void }

const clickSound = new Audio('https://www.soundjay.com/buttons/sounds/beep-07a.mp3')
clickSound.volume = 0.4
clickSound.preload = 'auto'

const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button
    className={`calc-btn${label === '⌫' ? ' calc-btn-backspace' : ''}`}
    aria-label={label}
    data-backspace={label === '⌫' ? 'true' : undefined}
    onClick={() => { if (onClick) onClick(); try { clickSound.currentTime = 0; clickSound.play() } catch {} }}
  >
    {label}
  </button>
)

export default Button 