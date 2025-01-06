import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Game from './game/Game.jsx';
import {fetchLetter, getWordValue, resetBag} from './utils/LetterUtils.jsx'
import {flashTile, shakeScreen} from './utils/AnimationUtils.jsx';
import TileSet from "./components/TileSet.jsx";
import {
  dictionaryUtils,
  loadDictionary,
  randomWord
} from "./utils/DictionaryUtils.jsx";
import game from "./game/Game.jsx";
import {DamageBox} from "./components/DamageBox.jsx";

const maxHealth = 100;
const tickRate = 1000;

function App() {
  const [title, setTitle] = useState("")
  const [count, setCount] = useState(16);
  const [letters, setLetters] = useState([]);
  const [selected, setSelected] = useState([]);

  const [gameState, setGameState] = useState(false);
  const [health, setHealth] = useState(maxHealth);
  const [gameTime, setGameTime] = useState(0);
  const [gameResults, setGameResults] = useState({});

  const startGame = () => {
    resetBag();
    const newLetters = letters.map((letter, idx) => {
      flashTile("tile-" + idx);
      return fetchLetter();
    });
    setLetters(newLetters);
    setSelected([]);
    setTitle("");
    setGameTime(0);
    setHealth(maxHealth);
    setGameState(true);
  };

  useEffect(() => {
    if (gameState && health > 0) {
      const healthInterval = setInterval(() => {
        setGameTime((t) => t + tickRate);
        setHealth((prevHealth) => {
          const decrement = 1 + Math.floor(gameTime / 30000);
          return Math.max(Math.ceil(prevHealth - decrement), 0);
        });
      }, tickRate);

      return () => {
        clearInterval(healthInterval);
      }
    } else {
      setGameState(false);
    }
  }, [gameState, health]);

  useEffect(() => {
    const startup = async () => {
      await loadDictionary();
      setTitle(randomWord().toUpperCase());
    };

    void startup();
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
      } else if (e.key === "Escape") {
        setSelected([]);
        setGameState(false);
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
    if (selected.includes(index)) {
      setSelected((prevSelected) => prevSelected.filter((idx) => idx !== index));
      flashTile("tile-" + index.toString());
    } else if (title.length < count) {
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
    const wordValue = getWordValue(title);
    shakeScreen(wordValue);

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

      if (gameState) {setHealth(prevHealth => Math.min(prevHealth + wordValue, maxHealth))}

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
          <>
            <div className="flex w-60 h-60 justify-center">
              <DamageBox word={title}/>
            </div>
            <div className="bottom-container min-w-[30vh]">
              <h1
                className="justify-center text-center min-h-[5vw] font-semibold bg-inherit text-[4.5vw] border-b">
                {title}
              </h1>

              {!gameState && (
                <div className="mt-8 text-center" id="countBar">
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-52"
                  />
                  <output
                    className="grid justify-center text-sm text-gray-400">Tile
                    Count: {count}</output>
                </div>)}

              <div className="items-center justify-items-center mt-8">
                <TileSet
                  letters={letters}
                  selected={selected}
                  handleLetter={handleLetter}
                  handleBackspace={handleBackspace}
                  handleEnter={handleEnter}
                />
                {!gameState && (
                  <button className="mt-4" onClick={startGame}>
                    START
                  </button>)}
              </div>
              <div className="justify-self-center w-60 mt-8 bg-red-600">
                <div className="health-bar"
                     style={{width: `${100 * (health / maxHealth)}%`}}>
                </div>
              </div>
              <p>{health}</p>
            </div>
          </>
        }
      />
      <Route path="/the-wordler/game" element={<Game/>}/>
    </Routes>
  );
}

export default App;