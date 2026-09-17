import './App.css';
import {Route, Routes} from 'react-router-dom';
import {useWordlerGame} from './game/useWordlerGame.js';
import TileSet from "./components/TileSet.jsx";
import {DamageBox} from "./components/DamageBox.jsx";
import {HealthBar} from "./components/HealthBar.jsx";
import {GameResults} from "./components/GameResults.jsx";
import {Instructions} from "./components/InstructionBox.jsx";

function App() {
  const game = useWordlerGame();
  const {
    count, gameState, gameTime, handleBackspace, handleEnter, handleLetter,
    handleShuffle,
    health, healthIncrease, healthDecrease, letters, score, selected, setCount,
    setShowInstructions, setShowResults, showInstructions, showResults,
    startGame, title, wordList, maxHealth, tickRate,
  } = game;

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <>
            <div className="grid w-[25vh] h-[25vh] place-content-center">
              <DamageBox word={title}/>
            </div>

            <div className="min-w-[30vh] place-content-start">
              <h1
                className="justify-center text-center min-h-[5vw] font-semibold bg-inherit text-[4.5vw] border-b">
                {title}
              </h1>
            </div>

            {!gameState && (
              <div className="mt-4" id="countBar">
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-52"
                />
                <output
                  className="grid text-center text-sm text-gray-400">Tile
                  Count: {count}</output>
              </div>)}

            <div className="mt-4">
              <TileSet
                letters={letters}
                selected={selected}
                handleLetter={handleLetter}
                handleBackspace={handleBackspace}
                handleEnter={handleEnter}
                handleShuffle={handleShuffle}
              />
            </div>

            <div className="grid grid-flow-col mt-4 gap-2">
              {!gameState && (
                <button onClick={() => setShowInstructions(true)}>
                  HOW TO PLAY
                </button>)}
              {!gameState && (
                <button onClick={startGame}>
                  START
                </button>)}
              {!gameState && gameTime !== 0 && (
                <button onClick={() => setShowResults(true)}>
                  LAST GAME
                </button>)}
            </div>

            <div className="mt-4">
              <HealthBar
                health={health}
                maxHealth={maxHealth}
                healthIncrease={healthIncrease}
                healthDecrease={healthDecrease}
                tickRate={tickRate}
              />
            </div>

            {showResults && (
              <GameResults
                gameTime={gameTime}
                score={score}
                wordList={wordList}
                showResults={setShowResults}
              />
            )}
            {showInstructions && (
              <Instructions showInstructions={setShowInstructions} />
            )}
          </>
        }
      />
    </Routes>
  );
}

export default App;