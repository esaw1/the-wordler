import React from 'react';
import {getLetterValue} from "../utils/LetterUtils.jsx";

const TileSet = ({ letters, selected, handleLetter, handleBackspace, handleEnter }) => {
  return (
    <div className="relative flex flex-wrap max-w-[220px] justify-center gap-2">
      {letters.map((letter, index) => (
        <div
          key={index}
          id={"tile-" + index.toString()}
          className={`relative tile flashing ${selected.includes(index) ? "selected" : ""}`}
          onClick={() => {
            handleLetter(letter, index);
          }}
        >
          {letter}
          <p className="tile-number text-gray-300">{getLetterValue(letter)}</p>
        </div>
      ))}
      <div
        id="backspace"
        className="tile flashing absolute top-0 -right-16"
        onClick={() => {
          handleBackspace();
        }}
      >
        <span>&#9003;</span>
      </div>
      <div
        id="enter"
        className="tile flashing absolute bottom-0 -right-16"
        onClick={() => {
          handleEnter();
        }}
      >
        <span>&#8629;</span>
      </div>
    </div>
  );
};

export default TileSet;