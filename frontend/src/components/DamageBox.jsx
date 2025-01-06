import React, {useEffect} from 'react';
import {getWordValue} from "../utils/LetterUtils.jsx";

export const DamageBox = ({ word }) => {
  const value = getWordValue(word);

  useEffect(() => {
    const shakeSpeed = Math.round(10 * (5 / value)) / 10;
    const shakeStrength = Math.round(10 * (value)) / 10;

    document.getElementById("damage-box").style.setProperty('--shake-speed', `${shakeSpeed}s`);
    document.getElementById("damage-box").style.setProperty('--shake-strength', `${shakeStrength}px`);

    const shakeInterval = setInterval(() => {
      document.getElementById("damage-box").style.setProperty('--shake-dir-x', `${Math.random() * 2 - 1}`);
      document.getElementById("damage-box").style.setProperty('--shake-dir-y', `${Math.random() * 2 - 1}`);
    }, shakeSpeed * 1000);

    return () => clearInterval(shakeInterval);
  }, [value]);

  return (
    <div
      className="damage-box flex justify-center place-items-center shadow-sm shaking"
      id="damage-box"
      style={{
        fontSize: `${14 + value}px`,
        transition: "font-size 0.2s ease-out",

      }}
    >
      {value}
    </div>
  );
};
