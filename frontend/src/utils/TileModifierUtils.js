export const createTileModifier = (existingModifiers = [], index = -1, columnCount = 4) => {
  const roll = Math.random();

  if (roll < 0.03) {
    return {
      type: 'scoreMultiplier',
      value: 2,
      label: 'x2',
      color: '#da5f5f',
    };
  }

  const hasColumnLock = existingModifiers.some((modifier, modifierIndex) => (
    modifierIndex !== index
      && modifier?.type === 'columnLock'
      && modifierIndex % columnCount === index % columnCount
  ));

  if (roll < 0.06 && !hasColumnLock) {
    return {
      type: 'columnLock',
      value: 1,
      label: '',
      color: '#f5f5f5',
    };
  }

  if (roll < 0.07) {
    return {
      type: 'scoreMultiplier',
      value: 3,
      label: 'x3',
      color: '#d83333',
    };
  }

  return null;
};

export const getTileScoreMultiplier = (modifier) => (
  modifier?.type === 'scoreMultiplier' ? modifier.value : 1
);

export const isTileLocked = (index, tileModifiers, columnCount = 4) => (
  tileModifiers.some((modifier, modifierIndex) => (
    modifier?.type === 'columnLock'
      && modifierIndex % columnCount === index % columnCount
      && modifierIndex !== index
  ))
);
