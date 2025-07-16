import React, { useEffect, useState } from 'react'
import Calculator from './Calculator'
import './App.css'

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light')
  }, [theme])

  return (
    <>
      <button
        className="theme-toggle-btn"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? '🌙 Neon Dark' : '🌞 Neon Light'}
      </button>
      <Calculator />
    </>
  )
}

export default App
