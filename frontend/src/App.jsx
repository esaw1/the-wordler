import React, {useEffect, useState} from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Game from './game/Game.jsx';
import fetchLetter from './utils/fetchLetter.jsx'
import refreshAnimation from './utils/refreshAnimation.jsx'
import TileSet from "./components/TileSet.jsx";
import {
  loadDictionary,
  dictionaryUtils,
  randomWord
} from "./utils/dictionaryUtils.jsx";

function App() {
  const [title, setTitle] = useState("")
  const [count, setCount] = useState(16);
  const [letters, setLetters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const startup = async () => {
      await loadDictionary();
      setTitle(randomWord().toUpperCase());
    };

    startup();
  }, []);

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
      } else if (e.key === "Enter") {
        handleEnter();
        refreshAnimation("enter");
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

  const handleBackspace = () => {
    console.log(`Title: ${title}, Length: ${title.length}`);

    setTitle((prevTitle) => prevTitle.slice(0, -1));
  };

  const handleEnter = () => {
    console.log(`Title: ${title}, Length: ${title.length}`);

    if (dictionaryUtils(title)) {
      console.log(`hi`);
    }
  };

  const handleStartClick = () => {
    navigate('/the-wordler/game');
  };

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <div>
            <h1 className="text-center min-h-[3.8rem] justify-center font-semibold max-w-full min-w-[8em] bg-inherit text-[3.2em] border-b"
                style={{
                  width: `${title.length * 0.8}em`,
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
                className="grid justify-center card__text text-sm text-gray-400">Tile Count: {count}</output>
            </div>

            <div className="items-center justify-items-center">
              <TileSet
                letters={letters}
                handleLetterClick={handleLetterClick}
                handleBackspace={handleBackspace}
                handleEnter={handleEnter}
              />
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