const X2_CHANCE = 0.03;
const X3_CHANCE = 0.005;
const LOCK_CHANCE = 0.03;
const PLUS1_CHANCE = 0.08;
const PLUS2_CHANCE = 0.04;

export const TILE_MODIFIER_DEFINITIONS = [
  {
    type: 'scoreMultiplier',
    value: 2,
    label: 'x2',
    color: '#da5f5f',
    description: 'Double score',
  },
  {
    type: 'scoreMultiplier',
    value: 3,
    label: 'x3',
    color: '#d83333',
    description: 'Triple score',
  },
  {
    type: 'scoreAdder',
    value: 1,
    label: '+1',
    color: '#69c9cc',
    description: 'Add 1 point',
  },
  {
    type: 'scoreAdder',
    value: 2,
    label: '+2',
    color: '#31b8da',
    description: 'Add 2 points',
  },
  {
    type: 'lock',
    value: 1,
    label: '',
    color: '#f5f5f5',
    description: 'Locks adjacent tiles',
  },
];

const getModifierDefinition = (type, value) => (
  TILE_MODIFIER_DEFINITIONS.find((modifier) => (
    modifier.type === type && modifier.value === value
  ))
);

export const createTileModifier = (
  existingModifiers = [],
  index = -1,
  tileCount = existingModifiers.length,
  columnCount = 4,
) => {
  const roll = Math.random();
  let totalChance = 0;

  totalChance += X2_CHANCE;
  if (roll < totalChance) {
    return getModifierDefinition('scoreMultiplier', 2);
  }

  const isLocked = isTileLocked(index, existingModifiers);

  totalChance += LOCK_CHANCE;
  if (roll < totalChance && !isLocked) {
    const row = Math.floor(index / columnCount);
    const column = index % columnCount;
    const adjacentIndexes = [
      column > 0 ? index - 1 : -1,
      column < columnCount - 1 ? index + 1 : -1,
      row > 0 ? index - columnCount : -1,
      index + columnCount < tileCount ? index + columnCount : -1,
    ].filter((tileIndex) => tileIndex >= 0 && tileIndex < tileCount);
    const availableIndexes = adjacentIndexes
      .filter((tileIndex) => (
        existingModifiers[tileIndex]?.type !== 'lock'
          && !isTileLocked(tileIndex, existingModifiers)
      ));
    const lockedIndexes = availableIndexes;

    if (lockedIndexes.length >= 2) {
      return {
        ...getModifierDefinition('lock', 1),
        lockedIndexes,
      };
    }
  }

  totalChance += X3_CHANCE;
  if (roll < totalChance) {
    return getModifierDefinition('scoreMultiplier', 3);
  }

  totalChance += PLUS1_CHANCE;
  if (roll < totalChance) {
    return getModifierDefinition('scoreAdder', 1);
  }

  totalChance += PLUS2_CHANCE;
  if (roll < totalChance) {
    return getModifierDefinition('scoreAdder', 2);
  }

  return null;
};

export const getTileScoreMultiplier = (modifier) => (
  modifier?.type === 'scoreMultiplier' ? modifier.value : 1
);

export const getTileScoreAdder = (modifier) => (
  modifier?.type === 'scoreAdder' ? modifier.value : 0
);

export const isTileLocked = (index, tileModifiers = []) => (
  tileModifiers.some((modifier, modifierIndex) => (
    modifier?.type === 'lock'
      && modifier.lockedIndexes?.includes(index)
      && modifierIndex !== index
  ))
);
