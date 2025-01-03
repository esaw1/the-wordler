import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';  // Make sure this file is imported to apply custom styles

function App() {
  const [count, setCount] = useState(0);

  const randomLetters = () => {
    const letters = [];
    for (let i = 0; i < count; i++) {
      const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      letters.push(randomChar);
    }
    return letters;
  };

  return (
    <>
      <div className="flex justify-center">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-semibold text-center mt-8">Vite + React</h1>
      <div className="card mt-8 text-center">
        <input
          type="range"
          min="0"
          max="26"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-52"
        />
        <output className="flex justify-center card__text text-sm">{count}</output>
        <h2 className="mt-4">
          {count > 0 ? randomLetters().join(' ') : '\n'}
        </h2>
      </div>
      <p className="read-the-docs animate-bounce mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;