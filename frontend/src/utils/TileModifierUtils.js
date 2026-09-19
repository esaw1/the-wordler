const X2_CHANCE = 0.03;
const X3_CHANCE = 0.01;
const COLUMN_LOCK_CHANCE = 0.03;
const PLUS1_CHANCE = 0.05;
const PLUS2_CHANCE = 0.02;

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
    type: 'columnLock',
    value: 1,
    label: '',
    color: '#f5f5f5',
    description: 'Column lock',
  },
];

const getModifierDefinition = (type, value) => (
  TILE_MODIFIER_DEFINITIONS.find((modifier) => (
    modifier.type === type && modifier.value === value
  ))
);

export const createTileModifier = (existingModifiers = [], index = -1, columnCount = 4) => {
  const roll = Math.random();
  let totalChance = 0;

  totalChance += X2_CHANCE;
  if (roll < totalChance) {
    return getModifierDefinition('scoreMultiplier', 2);
  }

  const hasColumnLock = existingModifiers.some((modifier, modifierIndex) => (
    modifierIndex !== index
      && modifier?.type === 'columnLock'
      && modifierIndex % columnCount === index % columnCount
  ));

  totalChance += COLUMN_LOCK_CHANCE;
  if (roll < totalChance && !hasColumnLock) {
    return getModifierDefinition('columnLock', 1);
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

export const isTileLocked = (index, tileModifiers, columnCount = 4) => (
  tileModifiers.some((modifier, modifierIndex) => (
    modifier?.type === 'columnLock'
      && modifierIndex % columnCount === index % columnCount
      && modifierIndex !== index
  ))
);
