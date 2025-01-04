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
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [letters, title]);

  const handleLetterClick = (letter, index) => {
    console.log(`Tile clicked: ${letter}`);
    console.log(`Title: ${title}, Length: ${title.length}`);

    if (title.length < count) {
      setTitle((prevTitle) => prevTitle.concat(letter));
      setLetters((prevLetters) => {
        const newLetters = [...prevLetters];
        newLetters[index] = fetchLetter();
        return newLetters;
      });
    }
  };

  const handleStartClick = () => {
    navigate('/the-wordler/game');
  };

  const handleBackspace = () => {
    console.log(`Title: ${title}, Length: ${title.length}`);

    setTitle((prevTitle) => prevTitle.slice(0, -1));
  };

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <div className>
            <h1 className="flex text-center min-h-[3.8rem] justify-center font-semibold max-w-full min-w-[8em] bg-inherit text-[3.2em] border-b"
                style={{
                  width: `${title.length * 0.8}em`, // Adjust width based on title length
                }}>
              {title}
            </h1>
            <div className="card text-center">
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

            <div className="absolute left-0 right-0 flex flex-col items-center justify-items-center">
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