import React, {useEffect, useRef, useState} from 'react'
import {flashTile} from "../utils/AnimationUtils.jsx";
import {getLetterColor, getLetterWeight} from "../utils/LetterUtils.jsx";
import {TILE_MODIFIER_DEFINITIONS} from "../utils/TileModifierUtils.js";

export const Instructions = ({ showInstructions }) => {
  const [selected, setSelected] = useState([]);
  const [shufflePenaltyExample, setShufflePenaltyExample] = useState(5);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeout = useRef(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(closeTimeout.current);
    };
  }, []);

  const closeInstructions = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);
    setIsVisible(false);
    closeTimeout.current = setTimeout(() => showInstructions(false), 250);
  };

  const handleExampleLetter = (letter, index) => {
    if (!selected.includes(letter)) {
      setSelected((prevState) => [...prevState, letter]);
      flashTile("tile-example-" + index, undefined, '#4f46e5');
    } else {
      setSelected((prevState) => prevState.filter((l) => l !== letter));
      flashTile("tile-example-" + index);
    }
  };

  const handleShuffleExample = () => {
    flashTile('example-shuffle');
    setShufflePenaltyExample((previous) => previous + 3);
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] flex justify-start bg-black bg-opacity-50 transition-[opacity] duration-[250ms] ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={closeInstructions}
    >
      <div
        className={`instruction-panel relative h-full w-full max-w-[32rem] overflow-y-auto border-r p-5 text-center transition-[transform] duration-[250ms] ease-in-out ${isVisible && !isClosing ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="absolute top-0 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={closeInstructions}
        >
          ✕
        </div>

        <div className="instruction-section">
          <h2 className="instruction-header">GAMEPLAY</h2>
          <div className="mt-2 grid grid-flow-col gap-4">
          <div className="text-right">
            <p>Select tiles to form a word!</p>
            <p className="italic text-sm text-gray-400">Each tile can only be
              used once per word</p>
          </div>
          <div className="grid grid-flow-col gap-2">
            {['A', 'B'].map((letter, index) => (
              <div
                key={index}
                id={"tile-example-" + index.toString()}
                className={`relative tile ${selected.includes(letter) ? "selected" : ""}`}
                onClick={() => {
                  handleExampleLetter(letter, index);
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
          <p className="mt-4">
          Your health ticks down faster and faster...
          </p>
          <p className="italic text-[1.2rem]">
          Quickly enter words to replenish it!
          </p>
          <div className="mt-5 grid grid-cols-[4fr_1fr] justify-center gap-4">
          <p className="text-right">
            If you're stuck, you can <span style={{ color: "#72a3b9" }}>shuffle</span> the tiles, with an increasing cost to your health.
          </p>
          <div
            className="tile relative shrink-0"
            id="example-shuffle"
            role="button"
            tabIndex="0"
            onClick={handleShuffleExample}
          >
            <span>&#8635;</span>
            <div
              className="shuffle-penalty absolute top-[0%] left-[32%] w-full text-center text-[10px]"
            >
              -{shufflePenaltyExample}
            </div>
          </div>
          </div>
        </div>

        <div className="instruction-section mt-5">
          <h2 className="instruction-header">SCORING</h2>
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
          calculated based on the total weight of its letters. 
          Longer words <span style={{ color: "#72a3b9" }}>give bonus score </span>
          and <span style={{ color: "#72a3b9" }}>reduce health drainage!</span></p>
        <p className="mt-5">For full detail, scoring uses <a href="https://www.desmos.com/calculator/ixeafzew2t" target="_blank"> this curve</a>.</p>
          <p className="text-sm italic text-gray-400">
          Largely based off of the word game <a
          href="https://en.wikipedia.org/wiki/Bookworm_(video_game)" target="_blank">Bookworm</a>
          </p>
        </div>

        <div className="instruction-section mt-5">
          <h2 className="instruction-header">TILE MODIFIERS</h2>
          <p className="mt-2">Some tiles have special modifiers that can affect your score!</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {TILE_MODIFIER_DEFINITIONS.map((modifier, index) => (
              <div key={modifier.description} className="flex w-14 flex-col items-center gap-1">
                <div className={`tile relative`}>
                  <span>{String.fromCharCode(65 + index)}</span>
                  <span
                    className="tile-modifier"
                    style={{'--modifier-color': modifier.color}}
                  >
                    <span className="tile-modifier-label">{modifier.label}</span>
                  </span>
                </div>
                <span className="text-xs text-gray-400">{modifier.description}</span>
              </div>
            ))}
            <div className="flex w-14 flex-col items-center gap-1">
              <div className="tile locked relative">
                <span>F</span>
              </div>
              <span className="text-xs text-gray-400">Locked tile</span>
            </div>
          </div>
          <p className="mt-2"></p>
        </div>
      </div>
    </div>
  );
};