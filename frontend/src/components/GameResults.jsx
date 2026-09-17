/* eslint-disable react/prop-types */
import {useEffect, useRef, useState} from 'react';
import {getLeaderboard, recordGame} from '../utils/LeaderboardUtils.js';
import {getLetterColor} from '../utils/LetterUtils.jsx';

export const GameResults = ({gameId, score, gameTime, wordList, showResults}) => {
  const [leaderboard, setLeaderboard] = useState(getLeaderboard);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeout = useRef(null);

  useEffect(() => {
    if (gameId) {
      setLeaderboard(recordGame(gameId, score, gameTime, wordList));
    }
  }, [gameId, score, gameTime, wordList]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(closeTimeout.current);
    };
  }, []);

  const closeLeaderboard = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);
    setIsVisible(false);
    closeTimeout.current = setTimeout(() => showResults(false), 250);
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] flex justify-end bg-black bg-opacity-50 transition-[opacity] duration-[250ms] ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={closeLeaderboard}
    >
      <div
        className={`results-panel relative h-full w-full max-w-[32rem] overflow-y-auto border-l p-5 text-center transition-[transform] duration-[250ms] ease-in-out ${isVisible && !isClosing ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          boxShadow: '-5px 0 15px rgba(0,0,0,0.3)',
          borderColor: '#3d434d',
          backgroundColor: '#1f2025',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="absolute top-0 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={closeLeaderboard}
        >
          ✕
        </div>

        <h2 className="text-[2rem] font-semibold text-center">ALL-TIME LEADERBOARD</h2>

        <div className="grid grid-cols-1 gap-6 mt-5 text-left sm:grid-cols-[3fr_2fr]">
          <section>
            <h3 className="text-xl font-semibold border-b pb-1">TOP SCORES</h3>
            <ul className="mt-2 space-y-1">
              {leaderboard.scores.length === 0 && <li className="text-gray-400">No scores yet</li>}
              {leaderboard.scores.map(({score: savedScore, date, durationSeconds}, index) => (
                <li key={`${savedScore}-${index}`} className="grid grid-cols-[1fr_3fr_1fr] items-baseline gap-2">
                  <span className="block">{savedScore}</span>
                  <span className="block overflow-visible text-center text-sm text-gray-400">
                    {date ? new Date(date).toLocaleDateString() : 'Date unavailable'}
                  </span>
                  <span className="block text-right text-sm text-gray-400">
                    {durationSeconds ?? '?'}s
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold border-b pb-1">TOP WORDS</h3>
            <ul className="mt-2 space-y-1">
              {leaderboard.words.length === 0 && <li className="text-gray-400">No words yet</li>}
              {leaderboard.words.map(({word, value, gameId: wordGameId}, index) => (
                <li key={`${wordGameId}-${word}-${index}`} className="grid grid-cols-[1fr_auto]">
                  <span>
                    {word.split('').map((letter, letterIndex) => (
                      <span key={`${word}-${letterIndex}`} style={{color: getLetterColor(letter)}}>
                        {letter}
                      </span>
                    ))}
                  </span>
                  <span className="text-gray-400">+{value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>


    </div>
  );
};