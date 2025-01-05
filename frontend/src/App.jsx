import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Game from './game/Game.jsx';
import fetchLetter from './utils/LetterUtils.jsx'
import {flashTile, refreshAnimation} from './utils/RefreshAnimation.jsx';
import TileSet from "./components/TileSet.jsx";
import {
  dictionaryUtils,
  loadDictionary,
  randomWord
} from "./utils/DictionaryUtils.jsx";

function App() {
  const [title, setTitle] = useState("")
  const [count, setCount] = useState(16);
  const [letters, setLetters] = useState([]);
  const [selected, setSelected] = useState([]);

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

    setSelected((prevSelected) => prevSelected.filter((idx) => (idx < count)));

  }, [count, letters.length]);

  useEffect(() => {
    setTitle(() => selected.map((index) => letters[index]).join(''));
  }, [selected]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const pressedKey = e.key.toUpperCase();
      if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter") {
        handleEnter();
      } else {
        let index = letters.indexOf(pressedKey);
        while (index !== -1 && selected.includes(index)) {
          index = letters.indexOf(pressedKey, index + 1);
        }
        if (index !== -1) {
          handleLetter(letters[index], index);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [letters, title]);

  const handleLetter = (letter, index) => {
    if (title.length < count && !selected.includes(index)) {
      flashTile("tile-" + index.toString(), undefined, '#4f46e5');
      setSelected((prevSelected) => [...prevSelected, index]);
    }
  };

  const handleBackspace = () => {
    flashTile("backspace");
    setSelected((prevSelected) => prevSelected.slice(0,-1));
  };

  const handleEnter = () => {
    flashTile("enter");
    if (title.length >= 3 && dictionaryUtils(title)) {
      selected.forEach((idx) => flashTile("tile-" + idx, '#22c55e', '#2d2d2d'));
      setLetters((prevLetters) => {
        return prevLetters.map((letter, index) => {
          if (selected.includes(index)) {
            return fetchLetter();
          } else {
            return letter;
          }
        });
      });
    } else {
      selected.forEach((idx) => flashTile("tile-" + idx, '#ef4444', '#2d2d2d'));
    }

    setSelected([]);
  };

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <div>
            <h1 className="justify-center text-center min-h-[5vw] font-semibold bg-inherit text-[4.5vw] border-b">
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
                selected={selected}
                handleLetter={handleLetter}
                handleBackspace={handleBackspace}
                handleEnter={handleEnter}
              />
              <button className="mt-4">
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