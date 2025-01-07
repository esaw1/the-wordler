import React from 'react';

export const GameResults = ({ gameTime, score, wordList, showResults }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-[1000] flex items-center justify-center">
      <div
        className="relative p-8 border rounded-md border-gray-600 bg-gray-800 max-w-[75%]"
        style={{
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="absolute top-0 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={() => showResults(false)}
        >
          ✕
        </div>

        <h2 className="text-lg font-semibold text-center">GAME OVER</h2>

        <p>Time Elapsed: {gameTime / 1000}s</p>
        <p>Score: {score}</p>

        <h3 className="mt-4 text-center font-semibold">WORDS ENTERED</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {wordList.map(({word, value}, index) => (
            <li key={index} className="flex justify-between">
              <span>{word}</span>
              <span className="text-gray-400">+{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};