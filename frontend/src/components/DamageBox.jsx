import React, {useEffect, useRef} from 'react';
import {getWordValue} from "../utils/LetterUtils.jsx";

export const DamageBox = ({ word }) => {
  const value = getWordValue(word);
  const el = document.getElementById("damage-box");

  const randomDirections = useRef(
    Array.from({ length: 200 }, () => Math.random() * 2 - 1)
  );

  useEffect(() => {
    if (el) {
      let index = 0;
      const handleAnimationIteration = () => {
        const dirX = randomDirections.current[index % randomDirections.current.length];
        const dirY = randomDirections.current[(index + 1) % randomDirections.current.length];
        el.style.setProperty('--shake-dir-x', dirX.toFixed(2));
        el.style.setProperty('--shake-dir-y', dirY.toFixed(2));
        index += 2;
      };

      el.addEventListener("animationiteration", handleAnimationIteration);

      return () => {
        el.removeEventListener("animationiteration", handleAnimationIteration);
      };
    }
  }, [el]);

  const shakeSpeed = Math.round(300 - value * 2) ;
  const shakeStrength = Math.round(8 * (value)) / 10;

  useEffect(() => {
    if (el) {
      el.style.setProperty('--shake-speed', `${shakeSpeed}ms`);
      el.style.setProperty('--shake-strength', `${shakeStrength}px`);
    }

  }, [value]);

  return (
    <div
      className="damage-box flex justify-center place-items-center shadow-sm shaking"
      id="damage-box"
      style={{
        fontSize: `${14 + value * 8}px`,
        transition: "font-size 0.2s ease-out",

      }}
    >
      {value}
    </div>
  );
};
