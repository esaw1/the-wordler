import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);


  const randomLetters = () => {
    const letters = [];
    for (let i = 0; i < count; i++) {
      const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      letters.push(randomChar);
    }
    return letters;
  }

  return (
    <>
      <div className="justify-center">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo"/>
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react"
               alt="React logo"/>
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <input
          type="range"
          min="0"
          max="26"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <output className="card__text"> {count}</output>
        <h2>
          {count > 0 ? randomLetters().join(' ') : '\n'}
        </h2>
      </div>
      <p className="read-the-docs animate-bounce">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
