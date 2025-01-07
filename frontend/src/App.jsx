import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Game from './game/Game.jsx';
import {fetchLetter, getWordValue, resetBag} from './utils/LetterUtils.jsx'
import {
  flashBackground,
  flashTile,
  shakeScreen
} from './utils/AnimationUtils.jsx';
import TileSet from "./components/TileSet.jsx";
import {
  dictionaryUtils,
  loadDictionary,
  randomWord
} from "./utils/DictionaryUtils.jsx";
import {DamageBox} from "./components/DamageBox.jsx";
import {HealthBar} from "./components/HealthBar.jsx";
import {GameResults} from "./components/GameResults.jsx";

const maxHealth = 50;
const tickRate = 1000;

function App() {
  const [title, setTitle] = useState("")
  const [count, setCount] = useState(16);
  const [letters, setLetters] = useState([]);
  const [selected, setSelected] = useState([]);

  const [gameState, setGameState] = useState(false);
  const [health, setHealth] = useState(maxHealth);
  const [healthChange, setHealthChange] = useState(0);

  const [showResults, setShowResults] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [wordList, setWordList] = useState([]);

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
    setGameState(true);
    setScore(0);
    setWordList([]);
  };

  useEffect(() => {
    if (gameState && health > 0) {
      const healthInterval = setInterval(() => {
        setGameTime((t) => t + tickRate);
        setHealth((prevHealth) => {
          const decrement = Math.min(tickRate / 2000 + gameTime / 120000, tickRate / 500);
          setHealthChange(-decrement);
          console.log(`decrement:` + decrement);
          return Math.max(prevHealth - decrement, 0);
        });
      }, tickRate);

      return () => {
        clearInterval(healthInterval);
      }
    } else if (health <= 0) {
      flashBackground();
      setGameState(() => false);
      setSelected([]);
      setHealth(maxHealth);
      setShowResults(true);
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
    setTitle(selected.map((index) => letters[index]).join(''));
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
        setGameState((prevState) => {
          if (prevState) {
            flashBackground();
            setHealth(maxHealth);
          }
          return false;
        })
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

    if (title.length >= 3 && dictionaryUtils(title)) {
      if (gameState) {
        setHealth(prevHealth => Math.min(prevHealth + wordValue, maxHealth));
        setScore((n) => n + wordValue);
        setWordList((prevWords) => [...prevWords, {word: title, value: wordValue}]);
      }

      selected.forEach((idx) => flashTile("tile-" + idx, '#22c55e'));
      shakeScreen(wordValue);
      setHealthChange(wordValue + Math.random() * 0.01);
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
      selected.forEach((idx) => flashTile("tile-" + idx, '#ef4444'));
    }

    setSelected(() =>[]);
  };

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <>
            <div className="flex justify-center items-center w-[25vh] h-[25vh]">
              <DamageBox word={title}/>
            </div>
            <div className="min-w-[30vh] place-content-start">
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

              <div className="justify-items-center mt-4">
                <TileSet
                  letters={letters}
                  selected={selected}
                  handleLetter={handleLetter}
                  handleBackspace={handleBackspace}
                  handleEnter={handleEnter}
                />
              </div>
              <div className="flex flex-grow place-self-center mt-4 gap-2">
                {!gameState && (
                  <button onClick={startGame}>
                    START
                  </button>)}
                {!gameState && gameTime !== 0 && (
                  <button onClick={() => setShowResults(true)}>
                    LAST GAME
                  </button>)}
              </div>
              <div className="justify-self-center mt-4">
                <HealthBar
                  health={health}
                  maxHealth={maxHealth}
                  healthChange={healthChange}
                  tickRate={tickRate}
                />
              </div>
            </div>
            {showResults && (
              <GameResults
                gameTime={gameTime}
                score={score}
                wordList={wordList}
                showResults={setShowResults}
              />
            )}
          </>
        }
      />
      <Route path="/the-wordler/game" element={<Game/>}/>
    </Routes>
  );
}

export default App;