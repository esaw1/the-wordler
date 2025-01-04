import React, {useEffect, useState} from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Game from './game/Game.jsx';
import fetchLetter from './utils/FetchLetter.jsx'

function App() {
  const [title, setTitle] = useState("The Wordler")
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
  }, [count, letters.length]);

  const handleLetterClick = (letter, index) => {
    console.log(`Tile clicked: ${letter}`);
    setTitle(title.concat(letter));

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

  const handleTitleChange = () => {
    setTitle(title);
  }

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <div>
            <div className="flex font-semibold text-center mt-8">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="flex flex-wrap bg-inherit text-[3.2em] text-center border-b focus:outline-none"
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
                className="flex flex-wrap max-w-[220px] justify-center gap-2"
              >
                {letters.map((letter, index) => (
                  <div
                    key={index}
                    id={"tile-" + index.toString()}
                    className="h-12 w-12 flex items-center justify-center border border-white bg-gray-800 text-white text-lg rounded-sm cursor-pointer
                               hover:bg-gray-600 transition flashing"
                    onClick={() => {
                      handleLetterClick(letter, index);
                      const el = document.getElementById("tile-" + index.toString());
                      el.style.animation = 'none';
                      el.offsetHeight;
                      el.style.animation = null;
                    }}
                  >
                    {letter}
                  </div>
                ))}
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