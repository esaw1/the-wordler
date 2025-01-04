import React, {useEffect, useState} from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Game from './game/Game.jsx';
import fetchLetter from './utils/fetchLetter.jsx'
import refreshAnimation from './utils/refreshAnimation.jsx'

function App() {
  const [title, setTitle] = useState("THE WORDLER")
  const [count, setCount] = useState(16);
  const [letters, setLetters] = useState([]);

  const [clickedIndices, setClickedIndices] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (count > letters.length) {
      const newLetter = fetchLetter();
      setLetters((prevLetters) => [...prevLetters, newLetter]);
    } else if (count < letters.length) {
      setLetters((prevLetters) => prevLetters.slice(0, -1));
    }

    if (title.length > count) {
      setTitle(title.slice(0, count));
    }
  }, [count, letters.length]);

  const handleLetterClick = (letter, index) => {
    console.log(`Tile clicked: ${letter}`);
    if (title.length < count) {
      setTitle(title.concat(letter));
    }

    setLetters((prevLetters) => {
      const newLetters = [...prevLetters];
      newLetters[index] = fetchLetter();
      return newLetters;
    });

    setClickedIndices((clicked) => [...clicked, index]);
    setTimeout(() => {
      setClickedIndices((clicked) => clicked.filter((i) => i !== index));
    }, 600);
  };

  const handleStartClick = () => {
    navigate('/the-wordler/game');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value.toUpperCase());
  }

  const handleBackspace = () => {
    setTitle(title.slice(0,-1));
  }

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <div>
            <div className="flex font-semibold justify-center mt-8">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="min-w-[8em] bg-inherit text-[3.2em] text-center border-b focus:outline-none"
                style={{ width: `${title.length + 0.5}em` }}
              />
            </div>
            <div className="card mt-8 text-center">
              <input
                type="range"
                min="8"
                max="24"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-52"
              />
              <output
                className="flex justify-center card__text text-sm text-gray-400">Tile Count: {count}</output>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div
                className="relative flex flex-wrap max-w-[220px] justify-center gap-2">
                {letters.map((letter, index) => (
                  <div
                    key={index}
                    id={"tile-" + index.toString()}
                    className="tile flashing"
                    onClick={() => {
                      handleLetterClick(letter, index);
                      refreshAnimation("tile-" + index.toString());
                    }}
                  >
                    {letter}
                  </div>
                ))}
                <div
                  id="backspace"
                  className="tile flashing absolute top-0 -right-16"
                  onClick={() => {
                    handleBackspace();
                    refreshAnimation("backspace");
                  }}
                >
                  <span>&#8629;</span>
                </div>
              </div>
              <button className="mt-4" onClick={handleStartClick}>
                START
              </button>
            </div>
          </div>
        }
      />
      <Route path="/the-wordler/game" element={<Game/>}/>
    </Routes>
  );
}

export default App;