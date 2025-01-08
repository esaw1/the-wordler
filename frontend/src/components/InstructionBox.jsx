import React, {useEffect, useState} from 'react'
import {flashTile, refreshAnimation} from "../utils/AnimationUtils.jsx";
import {getLetterColor, getLetterWeight} from "../utils/LetterUtils.jsx";

export const Instructions = ({ showInstructions }) => {
  const [selected, setSelected] = useState([]);

  const handleLetter = (letter, index) => {
    if (!selected.includes(letter)) {
      setSelected((prevState) => [...prevState, letter]);
      flashTile("tile-example-" + index, undefined, '#4f46e5');
    } else {
      setSelected((prevState) => prevState.filter((l) => l !== letter));
      flashTile("tile-example-" + index);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[1000] flex items-center justify-center"
    >
      <div
        className="relative p-4 border rounded-md border-gray-600 bg-gray-800 max-w-[30rem] max-h-[80%] overflow-y-auto text-center"
        style={{
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="absolute top-0 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={() => showInstructions(false)}
        >
          ✕
        </div>

        <h2 className="text-[2rem] font-semibold">HOW TO PLAY</h2>
        <div className="mt-2 grid grid-flow-col gap-4">
          <div className="text-right">
            <p>Select tiles to form a word!</p>
            <p className="italic text-sm text-gray-400">Each tile can only be
              used once per word</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['A', 'B'].map((letter, index) => (
              <div
                key={index}
                id={"tile-example-" + index.toString()}
                className={`relative tile flashing ${selected.includes(letter) ? "selected" : ""}`}
                onClick={() => {
                  handleLetter(letter, index);
                }}
              >
                {letter}
                <div
                  className="tile-value"
                  style={{
                    backgroundColor: getLetterColor(letter),
                  }}
                />
              </div>
            ))}
          </div>
          <p
            className="w-[3rem] self-end font-semibold text-3xl border-b">{selected.join('')}</p>
        </div>

        <h2 className="text-[2rem] font-semibold mt-4">SCORING</h2>
        <p className="mt-2">Each letter has an assigned color and
          weight:</p>
        <div className="mt-2 justify-self-center w-[15%]">
          <ul className="space-y-1">
            {['A', 'B', 'V', 'J', 'X'].map((letter) => (
              <li className="flex justify-between">
              <span className="flex">
                <div className="tile-value self-center" style={{
                  position: "static",
                  backgroundColor: getLetterColor(letter),
                }}/>
              </span>
                <span
                  className="self-center text-gray-400">{getLetterWeight(letter).toFixed(3)}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2">The score of a word is then
          calculated based on the total weight of its letters. Longer words give bonus score!
        </p>
        <p className="mt-2">For full detail, scoring uses <a href="https://www.desmos.com/calculator/ixeafzew2t" target="_blank"> this curve</a>.</p>
        <p className="text-sm italic text-gray-400">
          Largely based off of the word game <a
          href="https://en.wikipedia.org/wiki/Bookworm_(video_game)" target="_blank">Bookworm</a>
        </p>

        <h2 className="text-[2rem] font-semibold mt-4">GAMEPLAY</h2>
        <p className="mt-2">
          Your health ticks down at a slowly increasing rate...
        </p>
        <p className="italic text-[1.2rem]">
          Quickly enter words to replenish it!
        </p>
      </div>
    </div>
  );
};