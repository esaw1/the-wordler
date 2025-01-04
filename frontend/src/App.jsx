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

  const navigate = useNavigate();

  useEffect(() => {
    if (count > letters.length) {
      const newLetter = fetchLetter();
      setLetters((prevLetters) => [...prevLetters, newLetter]);
    } else if (count < letters.length) {
      setLetters((prevLetters) => prevLetters.slice(0, -1));
    }

    if (title.length > count) {
      setTitle((prevTitle) => prevTitle.slice(0, count));
    }
  }, [count, letters.length]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const pressedKey = e.key.toUpperCase();
      if (e.key === "Backspace") {
        handleBackspace();
        refreshAnimation("backspace");
      } else {
        const index = letters.indexOf(pressedKey);
        if (index !== -1) {
          handleLetterClick(letters[index], index);
          refreshAnimation("tile-" + index.toString());
        }
      }
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [letters]);

  const handleLetterClick = (letter, index) => {
    console.log(`Tile clicked: ${letter}`);
    if (title.length < count) {
      setTitle((prevTitle) => prevTitle.concat(letter));
    }

    setLetters((prevLetters) => {
      const newLetters = [...prevLetters];
      newLetters[index] = fetchLetter();
      return newLetters;
    });
  };

  const handleStartClick = () => {
    navigate('/the-wordler/game');
  };

  const handleBackspace = () => {
    setTitle((prevTitle) => prevTitle.slice(0, -1))
  }

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <div>
            <div className="flex font-semibold justify-center mt-8">
              <h1
                className="min-w-[8em] bg-inherit text-[3.2em] text-center border-b focus:outline-none"
                style={{ width: `${title.length + 0.5}em` }}
              >
                {title}
              </h1>
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