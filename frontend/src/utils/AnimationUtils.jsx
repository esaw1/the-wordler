export const refreshAnimation = (id) => {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = null;
}

export const flashTile = (id, startColor = '#6366f1', endColor) => {
  const tile = document.getElementById(id);
  if (tile) {
    tile.style.setProperty('--flash-start', startColor);
    if (endColor === undefined) {
      tile.style.removeProperty('--flash-end');
    } else {
      tile.style.setProperty('--flash-end', endColor);
    }
    refreshAnimation(id);
  }
}

const randomDirections = Array.from({ length: 100 }, () => Math.random() * 2 - 1);

export const getRandomDirections = () => {
  return randomDirections;
}

export const shakeScreen = (value) => {
  const el = document.getElementById("root");
  if (el && !el.classList.contains("flashing")) {
    const totalIterations = Math.floor(6 + value / 3);
    let currentIteration = 0;
    let index = Math.floor(Math.random() * randomDirections.length);

    el.style.setProperty('--shake-amount', `${totalIterations}`);
    el.style.setProperty('--shake-speed', `${Math.max(40 - value, 15)}ms`);
    el.style.setProperty('--shake-strength', `${Math.round(20 * value / 10)}px`);

    refreshAnimation("root");
    el.classList.add('shake-screen');

    const updateShakeDirection = () => {
      const dirX = randomDirections[index % randomDirections.length];
      const dirY = randomDirections[(index + 1) % randomDirections.length];
      el.style.setProperty('--shake-dir-x', dirX.toFixed(2));
      el.style.setProperty('--shake-dir-y', dirY.toFixed(2));
      currentIteration++;
      index++;

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

let timer;

export const flashBackground = (timeout = 300) => {
  const el = document.getElementById("root");
  if (el) {
    el.classList.add('flashing');
    refreshAnimation("root");

    el.addEventListener('animationend', () => {
      el.classList.remove('flashing');
    });
  }

  clearTimeout(timer);
  timer = setTimeout(() => {
  }, timeout);
};

