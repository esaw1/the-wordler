import {useCallback, useEffect, useRef, useState} from 'react';
import {
  flashBackground,
  flashTile,
  shakeScreen,
} from '../utils/AnimationUtils.jsx';
import {
  dictionaryUtils,
  loadDictionary,
  randomWord,
} from '../utils/DictionaryUtils.jsx';
import {
  fetchLetter,
  getWordValue,
  resetBag,
} from '../utils/LetterUtils.jsx';
import {
  createTileModifier,
  getTileScoreMultiplier,
  getTileScoreAdder,
  isTileLocked,
} from '../utils/TileModifierUtils.js';

const MAX_HEALTH = 100;
const TICK_RATE = 1000; // 1 second
const DECREMENT_RATE = 60000; // 1 minute
const INITIAL_TILE_COUNT = 16;
const INITIAL_DECREMENT = TICK_RATE / 2000; // 0.5 seconds
const createGameId = () => window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
export function useWordlerGame() {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(INITIAL_TILE_COUNT);
  const [letters, setLetters] = useState([]);
  const [tileModifiers, setTileModifiers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [healthIncrease, setHealthIncrease] = useState(0);
  const [healthDecrease, setHealthDecrease] = useState(0);
  const [shuffleHealthDecrease, setShuffleHealthDecrease] = useState(0);
  const [decrement, setDecrement] = useState(INITIAL_DECREMENT);
  const [shufflePenalty, setShufflePenalty] = useState(5);
  const [shuffleVersion, setShuffleVersion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [gameId, setGameId] = useState(null);
  const elapsedTimeRef = useRef(0);

  const handleLetter = useCallback((letter, index) => {
    if (isTileLocked(index, tileModifiers)) {
      return;
    }

    if (selected.includes(index)) {
      setSelected((previous) => previous.filter((tileIndex) => tileIndex !== index));
      flashTile(`tile-${index}`);
    } else if (title.length < count) {
      flashTile(`tile-${index}`, undefined, '#4f46e5');
      setSelected((previous) => [...previous, index]);
    }
  }, [count, selected, tileModifiers, title]);

  const handleBackspace = useCallback(() => {
    flashTile('backspace');
    setSelected((previous) => previous.slice(0, -1));
  }, []);

  const handleEnter = useCallback(() => {
    flashTile('enter');
    const wordValue = getWordValue(title);
    const wordAdder = selected
      .map((index) => getTileScoreAdder(tileModifiers[index]))
      .reduce((total, adder) => total + adder, 0);
    const wordMultiplier = selected
      .map((index) => getTileScoreMultiplier(tileModifiers[index]))
      .reduce((total, multiplier) => total * multiplier, 1);
    const modifierCount = selected.filter(
      (index) => getTileScoreMultiplier(tileModifiers[index]) > 1,
    ).length;
    const wordScore = (wordValue + wordAdder) * wordMultiplier;

    if (title.length >= 3 && dictionaryUtils(title)) {
      if (gameState) {
        setHealth((previous) => Math.min(previous + wordScore, MAX_HEALTH));
        setScore((previous) => previous + wordScore);
        setWordList((previous) => [...previous, {
          word: title,
          value: wordScore,
          modifierCount,
          multiplier: wordMultiplier,
          adder: wordAdder,
        }]);
        
        if (wordScore >= 6) {
          setDecrement((previous) => Math.max(previous - wordScore / 100, 0.1));
        }
      }

      selected.forEach((index) => flashTile(`tile-${index}`, '#22c55e'));
      shakeScreen(wordScore >= 4 ? wordScore : 0);
      setHealthIncrease(wordScore + Math.random() * 0.01);
      setLetters((previous) => previous.map((letter, index) => (
        selected.includes(index) ? fetchLetter() : letter
      )));
      setTileModifiers((previous) => {
        const next = [...previous];
        selected.forEach((index) => {
          next[index] = createTileModifier(next, index);
        });
        return next;
      });
    } else {
      selected.forEach((index) => flashTile(`tile-${index}`, '#ef4444'));
    }

    setSelected([]);
  }, [gameState, selected, tileModifiers, title]);

  const handleShuffle = useCallback(() => {
    flashTile('shuffle');
    resetBag();
    setShuffleVersion((previous) => previous + 1);
    setLetters((previous) => previous.map((letter, index) => {
      flashTile(`tile-${index}`, '#6891b8');
      return fetchLetter();
    }));
    setTileModifiers((previous) => {
      const next = [...previous];
      next.forEach((_, index) => {
        next[index] = createTileModifier(next, index);
      });
      return next;
    });
    setSelected([]);
    if (gameState === true) {
      setShuffleHealthDecrease(shufflePenalty);
      setHealth((previous) => Math.max(previous - shufflePenalty, 0));
      setShufflePenalty((previous) => previous + 3);
    }
  }, [gameState, shufflePenalty]);

  const startGame = () => {
    setGameId(createGameId());
    resetBag();
    setTileModifiers((previous) => {
      const next = [...previous];
      next.forEach((_, index) => {
        next[index] = createTileModifier(next, index);
      });
      return next;
    });
    setSelected([]);
    setTitle('');
    elapsedTimeRef.current = 0;
    setGameTime(0);
    setGameState(true);
    setHealth(MAX_HEALTH / 2);
    setDecrement(INITIAL_DECREMENT);
    setShufflePenalty(5);
    setShuffleVersion((previous) => previous + 1);
    setLetters((previous) => previous.map((letter, index) => {
      flashTile(`tile-${index}`, '#6891b8');
      return fetchLetter();
    }));
    setScore(0);
    setWordList([]);
  };

  const endGame = useCallback(() => {
    setShowInstructions(false);
    setShowResults(false);
    setSelected([]);
    setGameState((previous) => {
      if (previous) {
        flashBackground();
        setHealth(MAX_HEALTH);
      }
      return false;
    });
  }, []);

  useEffect(() => {
    if (!gameState) {
      return undefined;
    }

    const healthInterval = setInterval(() => {
      elapsedTimeRef.current += TICK_RATE;
      setGameTime(elapsedTimeRef.current);

      setDecrement((previous) => {
        const nextDecrement = Math.min(
          previous + TICK_RATE / DECREMENT_RATE,
          (TICK_RATE / 1000) * 1.5,
        );
        setHealthDecrease(nextDecrement);
        setHealth((previousHealth) => Math.max(previousHealth - nextDecrement, 0));
        return nextDecrement;
      });
    }, TICK_RATE);

    return () => clearInterval(healthInterval);
  }, [gameState]);

  useEffect(() => {
    if (gameState && health <= 0) {
      flashBackground();
      setGameState(false);
      setSelected([]);
      setShuffleVersion(0);
      setHealth(MAX_HEALTH);
      setShowResults(true);
    }
  }, [gameState, health]);

  useEffect(() => {
    const startup = async () => {
      await loadDictionary();
      setTitle(randomWord().toUpperCase());
    };

    void startup();
  }, []);

  useEffect(() => {
    setLetters((previous) => {
      if (count > previous.length) {
        return [
          ...previous,
          ...Array.from({length: count - previous.length}, () => fetchLetter()),
        ];
      }
      if (count < previous.length) {
        return previous.slice(0, count);
      }
      return previous;
    });
    setTileModifiers((previous) => {
      if (count > previous.length) {
        const next = [...previous];
        while (next.length < count) {
          const index = next.length;
          next.push(createTileModifier(next, index));
        }
        return next;
      }
      if (count < previous.length) {
        return previous.slice(0, count);
      }
      return previous;
    });
    setSelected((previous) => previous.filter((index) => index < count));
  }, [count]);

  useEffect(() => {
    setTitle(selected.map((index) => letters[index]).join(''));
  }, [selected]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const pressedKey = event.key.toUpperCase();
      if (event.key === 'Backspace') {
        handleBackspace();
      } else if (event.key === 'Enter') {
        handleEnter();
      } else if (event.key === 'Escape') {
        setSelected([]);
      } else {
        const matchingIndexes = letters
          .map((letter, index) => ({letter, index}))
          .filter(({letter, index}) => (
            letter === pressedKey
              && !selected.includes(index)
              && !isTileLocked(index, tileModifiers)
          ))
          .sort(({index: firstIndex}, {index: secondIndex}) => (
            Number(Boolean(tileModifiers[secondIndex]))
              - Number(Boolean(tileModifiers[firstIndex]))
              || firstIndex - secondIndex
          ));
        const index = matchingIndexes[0]?.index;
        if (index !== undefined) {
          handleLetter(letters[index], index);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [count, endGame, gameState, handleBackspace, handleEnter, handleLetter, handleShuffle, letters, selected, tileModifiers, title]);

  return {
    count,
    endGame,
    gameState,
    gameTime,
    gameId,
    handleBackspace,
    handleEnter,
    handleLetter,
    handleShuffle,
    health,
    healthIncrease,
    healthDecrease,
    shuffleHealthDecrease,
    decrement,
    shufflePenalty,
    shuffleVersion,
    letters,
    tileModifiers,
    score,
    selected,
    setCount,
    setShowInstructions,
    setShowResults,
    showInstructions,
    showResults,
    startGame,
    title,
    wordList,
    maxHealth: MAX_HEALTH,
    tickRate: TICK_RATE,
  };
}
