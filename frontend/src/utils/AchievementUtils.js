const ACHIEVEMENTS_KEY = 'the-wordler-achievements';

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'word-20', 
    title: 'XX', 
    description: 'Score 20 or more points in a single word.', 
    category: 'word', 
    threshold: 20},
  {
    id: 'word-30', 
    title: 'XXX', 
    description: 'Score 30 or more points in a single word.', 
    category: 'word', 
    threshold: 30},
  {
    id: 'word-50', 
    title: 'L', 
    description: 'Score 50 or more points in a single word.', 
    category: 'word', 
    threshold: 50},
  {
    id: 'word-100', 
    title: 'Century', 
    description: 'Score 100 or more points in a single word.', 
    category: 'word', 
    threshold: 100},
  {
    id: 'word-300', 
    title: 'Spartan', 
    description: 'Score 300 or more points in a single word.', 
    category: 'word', 
    threshold: 300},
  {
    id: 'word-1000', 
    title: 'Millenium', 
    description: 'Score 1,000 or more points in a single word.', 
    category: 'word', 
    threshold: 1000},
  {
    id: 'survive-60', 
    title: 'Minute', 
    description: 'Survive for 60 seconds in one game.', 
    category: 'survival', 
    threshold: 60},
  {
    id: 'survive-120', 
    title: 'Two Minutes', 
    description: 'Survive for 120 seconds in one game.', 
    category: 'survival', 
    threshold: 120},
];

const emptyAchievements = {unlocked: {}};

const readAchievements = () => {
  try {
    const saved = window.localStorage.getItem(ACHIEVEMENTS_KEY);
    const parsed = saved ? JSON.parse(saved) : emptyAchievements;
    return {
      unlocked: parsed?.unlocked && typeof parsed.unlocked === 'object'
        ? parsed.unlocked
        : {},
    };
  } catch {
    return {unlocked: {}};
  }
};

const writeAchievements = (achievements) => {
  try {
    window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // Achievements still work for the current session when storage is unavailable.
  }
};

export const getAchievements = () => {
  const saved = readAchievements();
  return ACHIEVEMENT_DEFINITIONS.map((achievement) => ({
    ...achievement,
    unlocked: Boolean(saved.unlocked[achievement.id]),
    unlockedAt: saved.unlocked[achievement.id] ?? null,
  }));
};

export const unlockAchievements = (achievementIds) => {
  const saved = readAchievements();
  const unlocked = {...saved.unlocked};
  const unlockedAt = new Date().toISOString();

  achievementIds.forEach((achievementId) => {
    if (!unlocked[achievementId]) {
      unlocked[achievementId] = unlockedAt;
    }
  });

  const updated = {unlocked};
  writeAchievements(updated);
  return getAchievements();
};

export const getWordAchievementIds = (score) => ACHIEVEMENT_DEFINITIONS
  .filter((achievement) => achievement.category === 'word' && score >= achievement.threshold)
  .map(({id}) => id);

export const getSurvivalAchievementIds = (seconds) => ACHIEVEMENT_DEFINITIONS
  .filter((achievement) => achievement.category === 'survival' && seconds >= achievement.threshold)
  .map(({id}) => id);
