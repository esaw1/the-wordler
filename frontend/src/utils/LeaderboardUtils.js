const LEADERBOARD_KEY = 'the-wordler-leaderboard';

const emptyLeaderboard = {
  scores: [],
  words: [],
  recordedGames: [],
};

const readLeaderboard = () => {
  try {
    const saved = window.localStorage.getItem(LEADERBOARD_KEY);
    return saved ? {...emptyLeaderboard, ...JSON.parse(saved)} : emptyLeaderboard;
  } catch {
    return emptyLeaderboard;
  }
};

const writeLeaderboard = (leaderboard) => {
  try {
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch {
    // Rankings still work for the current session when storage is unavailable.
  }
};

export const getLeaderboard = () => readLeaderboard();

export const recordGame = (gameId, score, gameTime, wordList) => {
  const leaderboard = readLeaderboard();
  if (!gameId || leaderboard.recordedGames.includes(gameId)) {
    return leaderboard;
  }

  const updatedLeaderboard = {
    scores: [
      ...leaderboard.scores,
      {
        gameId,
        score,
        date: new Date().toISOString(),
        durationSeconds: Math.round(gameTime / 1000),
      },
    ].sort((first, second) => second.score - first.score).slice(0, 5),
    words: [
      ...leaderboard.words,
      ...wordList.map(({word, value}) => ({word, value, gameId})),
    ].sort((first, second) => second.value - first.value).slice(0, 10),
    recordedGames: [...leaderboard.recordedGames, gameId],
  };

  writeLeaderboard(updatedLeaderboard);
  return updatedLeaderboard;
};