import React, {useEffect, useRef} from 'react';
import {getWordValue} from "../utils/LetterUtils.jsx";
import {getRandomDirections} from "../utils/AnimationUtils.jsx";
import {getTileScoreMultiplier} from "../utils/TileModifierUtils.js";

export const DamageBox = ({ word, tileModifiers, selected }) => {
  const wordMultiplier = selected
    .map((index) => getTileScoreMultiplier(tileModifiers[index]))
    .reduce((total, multiplier) => total * multiplier, 1);
  const value = getWordValue(word) * wordMultiplier;
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

  const shakeSpeed = value >= 4 ? Math.max(150 - value * 5, 30) : 0;
  const shakeStrength = value >= 4 ? Math.round(15 * value / 10) : 0;

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
      {wordMultiplier > 1 && (
        <span className="damage-multiplier">(x{wordMultiplier})</span>
      )}
      {value}
    </div>
  );
};
