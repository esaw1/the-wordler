import React, {useEffect, useRef} from 'react';
import {getWordValue} from "../utils/LetterUtils.jsx";
import {getRandomDirections} from "../utils/AnimationUtils.jsx";

export const DamageBox = ({ word }) => {
  const value = getWordValue(word);
  const el = document.getElementById("damage-box");
  const randomDirections = getRandomDirections();

  useEffect(() => {
    if (el) {
      let index = 0;
      const handleAnimationIteration = () => {
        const dirX = randomDirections[index % randomDirections.length];
        const dirY = randomDirections[(index + 1) % randomDirections.length];
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

  const shakeSpeed = Math.max(200 - value * 5, 30);
  const shakeStrength = Math.round(15 * value / 10);

  useEffect(() => {
    if (el) {
      el.style.setProperty('--shake-speed', `${shakeSpeed}ms`);
      el.style.setProperty('--shake-strength', `${shakeStrength}px`);
    }

  }, [value]);

  return (
    <div
      className="damage-box shaking"
      id="damage-box"
      style={{
        fontSize: `${Math.min(1 + value * 0.75, 25)}vh`,
        transition: "font-size 0.2s ease-out",

      }}
    >
      {value}
    </div>
  );
};
