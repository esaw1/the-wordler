import React from 'react';
import refreshAnimation from '../utils/refreshAnimation.jsx';

const TileSet = ({ letters, handleLetterClick, handleBackspace, handleEnter }) => {
  return (
    <div className="relative flex flex-wrap max-w-[220px] justify-center gap-2">
      {letters.map((letter, index) => (
        <div
          key={index}
          id={"tile-" + index.toString()}
          className="tile flashing"
          onClick={() => {
            handleLetterClick(letter, index);
            refreshAnimation("tile-" + index.toString());
          }}
        >
          {letter}
        </div>
      ))}
      <div
        id="backspace"
        className="tile flashing absolute top-0 -right-16"
        onClick={() => {
          handleBackspace();
          refreshAnimation("backspace");
        }}
      >
        <span>&#9003;</span>
      </div>
      <div
        id="enter"
        className="tile flashing absolute bottom-0 -right-16"
        onClick={() => {
          handleEnter();
          refreshAnimation("enter");
        }}
      >
        <span>&#8629;</span>
      </div>
    </div>
  );
};

export default TileSet;