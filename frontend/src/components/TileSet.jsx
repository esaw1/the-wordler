import React, {useEffect, useRef, useState} from 'react';
import { getLetterColor } from "../utils/LetterUtils.jsx";
import {isTileLocked} from "../utils/TileModifierUtils.js";

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const TileSet = ({ letters, tileModifiers, selected, handleLetter, handleBackspace, handleEnter, handleShuffle, shufflePenalty, shuffleVersion }) => {
  const [displayLetters, setDisplayLetters] = useState(letters);
  const timersRef = useRef([]);
  const previousShuffleVersionRef = useRef(shuffleVersion);

  useEffect(() => {
    const shouldAnimate = shuffleVersion > previousShuffleVersionRef.current;
    previousShuffleVersionRef.current = shuffleVersion;

    timersRef.current.forEach((timer) => {
      clearInterval(timer.interval);
      clearTimeout(timer.timeout);
    });
    timersRef.current = [];

    if (!shouldAnimate) {
      setDisplayLetters(letters);
      return undefined;
    }

    setDisplayLetters(letters.map(() => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]));

    letters.forEach((letter, index) => {
      const duration = 300 + Math.random() * 300;
      const interval = setInterval(() => {
        setDisplayLetters((previous) => previous.map((value, tileIndex) => (
          tileIndex === index
            ? ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
            : value
        )));
      }, 40);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setDisplayLetters((previous) => previous.map((value, tileIndex) => (
          tileIndex === index ? letter : value
        )));
      }, duration);

      timersRef.current.push({interval, timeout});
    });

    return () => {
      timersRef.current.forEach((timer) => {
        clearInterval(timer.interval);
        clearTimeout(timer.timeout);
      });
      timersRef.current = [];
    };
  }, [letters, shuffleVersion]);

  return (
    <div className="flex flex-wrap relative justify-center max-w-[220px] gap-2">
      {displayLetters.map((letter, index) => (
        <div
          key={index}
          id={"tile-" + index.toString()}
          className={`relative tile ${selected.includes(index) ? "selected" : ""} ${isTileLocked(index, tileModifiers) ? "locked" : ""}`}
          onClick={() => {
            handleLetter(letter, index);
          }}
        >
          <span className="tile-letter">{letter}</span>
          {tileModifiers[index] && (
            <span
              className="tile-modifier"
              title={tileModifiers[index].label}
              style={{'--modifier-color': tileModifiers[index].color}}
            >
              <span className="tile-modifier-label">{tileModifiers[index].label}</span>
            </span>
          )}
          <div
            className="tile-value"
            style={{
              backgroundColor: getLetterColor(letter),
            }}
          />
        </div>
      ))}
      <div
        id="backspace"
        className="tile absolute top-0 -right-16"
        onClick={() => {
          handleBackspace();
        }}
      >
        <span>&#9003;</span>
      </div>
      <div
        id="enter"
        className="tile absolute bottom-0 -right-16"
        onClick={() => {
          handleEnter();
        }}
      >
        <span>&#8629;</span>
      </div>
      <div
        id="shuffle"
        className="tile absolute bottom-14 -right-16"
        onClick={() => {
          handleShuffle();
        }}
      >
        <span>&#8635;</span>
        <div 
          className="shuffle-penalty absolute top-[0%] left-[32%] text-[10px] w-full text-center"
          >
          -{shufflePenalty}
        </div>
      </div>
    </div>
  );
};

export default TileSet;