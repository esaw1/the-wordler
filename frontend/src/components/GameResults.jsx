import React from 'react';

export const GameResults = ({ gameTime, score, wordList, showResults }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-[1000] flex items-center justify-center">
      <div
        className="relative p-4 border rounded-md border-gray-600 bg-gray-800 max-w-[75%] max-h-[80%] overflow-y-auto text-center"
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

        <h2 className="text-[2rem] font-semibold text-center">GAME OVER</h2>
        <p>Time Elapsed: {gameTime / 1000}s</p>
        <p className="mt-2">Final Score:</p>
        <p className="font-semibold text-[4rem] bg-gray-700 min-w-[10rem] rounded-lg border mt-1 place-self-center">{score}</p>


        <h3 className="mt-4 text-[2rem] text-center font-semibold">TOP WORDS</h3>
        <ul className="space-y-1 text-sm">
          {wordList.length === 0 && (
            <p className="text-center">:(</p>
          )}
          {wordList.sort((a, b) => b.value - a.value).map(({
                                                             word,
                                                             value
                                                           }, index) => (
            <li key={index}
                className="grid grid-cols-2 gap-4 place-self-center">
              <span className="text-right">{word}</span>
              <span className="text-gray-400 text-left">+{value}</span>
            </li>
          ))}
        </ul>
      </div>


    </div>
  );
};