import './App.css';
import {Route, Routes} from 'react-router-dom';
import {useWordlerGame} from './game/useWordlerGame.js';
import TileSet from "./components/TileSet.jsx";
import {DamageBox} from "./components/DamageBox.jsx";
import {HealthBar} from "./components/HealthBar.jsx";
import {GameResults} from "./components/GameResults.jsx";
import {Instructions} from "./components/InstructionBox.jsx";
import {Achievements} from "./components/AchievementBox.jsx";

function App() {
  const game = useWordlerGame();
  const {
    gameState, gameId, gameTime, handleBackspace, handleEnter, handleLetter,
    handleShuffle,
    health, healthIncrease, healthDecrease, shuffleHealthDecrease, decrement, letters, tileModifiers, score, selected,
    shufflePenalty, shuffleVersion,
    setShowInstructions, setShowResults, setShowAchievements,
    showAchievements, showInstructions, showResults, achievements,
    startGame, title, wordList, maxHealth, tickRate,
  } = game;

  return (
    <Routes>
      <Route
        path="/the-wordler/"
        element={
          <>
            <div className="grid w-[25vh] h-[25vh] place-content-center">
              <DamageBox word={title} tileModifiers={tileModifiers} selected={selected}/>
            </div>

            <div className="min-w-[30vh] place-content-start">
              <h1
                className="justify-center text-center min-h-[5vw] font-semibold bg-inherit text-[4.5vw] border-b">
                {title.split('').map((letter, index) => {
                  const modifier = tileModifiers[selected[index]];

                  return (
                    <span key={`${letter}-${index}`} style={modifier?.color ? {color: modifier.color} : undefined}>
                      {letter}
                    </span>
                  );
                })}
              </h1>
            </div>

            <div className="mt-5">
              <TileSet
                letters={letters}
                tileModifiers={tileModifiers}
                selected={selected}
                handleLetter={handleLetter}
                handleBackspace={handleBackspace}
                handleEnter={handleEnter}
                handleShuffle={handleShuffle}
                shufflePenalty={shufflePenalty}
                shuffleVersion={shuffleVersion}
              />
            </div>

            <div className="mt-5">
              <HealthBar
                health={health}
                maxHealth={maxHealth}
                healthIncrease={healthIncrease}
                healthDecrease={healthDecrease}
                shuffleHealthDecrease={shuffleHealthDecrease}
                decrement={decrement}
                tickRate={tickRate}
              />
            </div>

            <div className="grid grid-cols-3 mt-5 gap-2">
              {!gameState && (
                <button onClick={() => setShowInstructions(true)}>
                  HOW TO PLAY
                </button>)}
              {!gameState && (
                <button onClick={startGame}>
                  START
                </button>)}
              {!gameState && (
                <button onClick={() => setShowResults(true)}>
                  LEADERBOARD
                </button>)}
              {!gameState && (
                <button className="col-span-3 justify-self-center" onClick={() => setShowAchievements(true)}>
                  ACHIEVEMENTS
                </button>)}
            </div>

            {showResults && (
              <GameResults
                gameId={gameId}
                score={score}
                gameTime={gameTime}
                wordList={wordList}
                showResults={setShowResults}
              />
            )}
            {showInstructions && (
              <Instructions showInstructions={setShowInstructions} />
            )}
            {showAchievements && (
              <Achievements achievements={achievements} showAchievements={setShowAchievements} />
            )}
          </>
        }
      />
    </Routes>
  );
}

export default App;