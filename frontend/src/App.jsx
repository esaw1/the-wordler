import React, {useEffect, useState} from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Game from './game/Game.jsx';
import fetchLetter from './utils/FetchLetter.js'

function App() {
  const [count, setCount] = useState(16);
  const [letters, setLetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const updateLetters = async () => {
      if (count > letters.length) {
        const newLetter = await fetchLetter(letters);
        setLetters((prevLetters) => [...prevLetters, newLetter]);
      } else if (count < letters.length) {
        setLetters((prevLetters) => prevLetters.slice(0, -1));
      }
    };
    updateLetters();
  }, [count, letters.length]);

  const handleStartClick = () => {
    navigate('/the-wordler/game');
  };

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <div>
            <h1 className="font-semibold text-center mt-8">The Wordler</h1>
            <div className="card mt-8 text-center">
              <input
                type="range"
                min="8"
                max="24"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-52"
              />
              <output className="flex justify-center card__text text-2xl">{count}</output>
              <h2 className="mt-8 h-3">
                {letters.join(' ')}
              </h2>
            </div>
            <div>
              <button onClick={handleStartClick}>START</button>
            </div>
          </div>
        }
      />
      <Route path="/the-wordler/game" element={<Game />} />
    </Routes>
  );
}

export default App;