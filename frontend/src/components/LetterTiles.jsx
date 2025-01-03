import React from 'react';

const LetterTiles = ({ letters }) => {
  const handleClick = (letter) => {
    console.log(`Tile clicked: ${letter}`);
  };

  return (
    <div
      className="grid place-items-center grid-cols-8 gap-2 "
    >
      {letters.map((letter, index) => (
        <div
          key={index}
          className="h-16 w-16 flex items-center justify-center border border-white bg-slate-900 text-white text-lg rounded-sm cursor-pointer hover:bg-slate-500 transition"
          onClick={() => handleClick(letter)}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default LetterTiles;