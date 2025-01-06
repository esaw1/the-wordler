import {useRef} from "react";

export const animationUtils = (id) => {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = null;
}

export const flashTile = (id, startColor = '#6366f1', endColor = '#2d2d2d') => {
  const tile = document.getElementById(id);
  if (tile) {
    tile.style.setProperty('--flash-start', startColor);
    tile.style.setProperty('--flash-end', endColor);
    animationUtils(id);
  }
}

export const shakeScreen = (value) => {
  const el = document.getElementById("root");
  if (el) {
    el.classList.add('shake-screen');

    const totalIterations = Math.floor(5 + value / 5);
    let currentIteration = 0;

    el.style.setProperty('--shake-amount', `${totalIterations}`);
    el.style.setProperty('--shake-speed', `${Math.max(50 - value, 20)}ms`);
    el.style.setProperty('--shake-strength', `${Math.round(15 * value / 10)}px`);

    animationUtils("root");

    const updateShakeDirection = () => {
      el.style.setProperty('--shake-dir-x', `${Math.random() * 2 - 1}`);
      el.style.setProperty('--shake-dir-y', `${Math.random() * 2 - 1}`);
      currentIteration++;

      if (currentIteration >= totalIterations) {
        cleanup();
      }
    };

    const cleanup = () => {
      el.classList.remove('shake-screen');
      el.removeEventListener("animationiteration", updateShakeDirection);
    };

    el.addEventListener("animationiteration", updateShakeDirection);
  }
};