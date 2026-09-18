export const createTileModifier = () => {
  const roll = Math.random();

  if (roll < 0.03) {
    return {
      type: 'scoreMultiplier',
      value: 2,
      label: 'x2',
      color: '#dc2626',
    };
  }

  return null;
};

export const getTileScoreMultiplier = (modifier) => (
  modifier?.type === 'scoreMultiplier' ? modifier.value : 1
);
