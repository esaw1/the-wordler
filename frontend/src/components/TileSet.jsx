import React from 'react';
import { getLetterColor } from "../utils/LetterUtils.jsx";

const TileSet = ({ letters, selected, handleLetter, handleBackspace, handleEnter }) => {
  return (
    <div className="flex flex-wrap relative justify-center max-w-[220px] gap-2">
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