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

const MAX_HEALTH = 100;
const TICK_RATE = 1000;
const INITIAL_TILE_COUNT = 16;
const INITIAL_DECREMENT = TICK_RATE / 2000;

export function useWordlerGame() {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(INITIAL_TILE_COUNT);
  const [letters, setLetters] = useState([]);
  const [selected, setSelected] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [healthIncrease, setHealthIncrease] = useState(0);
  const [healthDecrease, setHealthDecrease] = useState(0);
  const [decrement, setDecrement] = useState(INITIAL_DECREMENT);
  const [shufflePenalty, setShufflePenalty] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [wordList, setWordList] = useState([]);
  const elapsedTimeRef = useRef(0);

  const handleLetter = useCallback((letter, index) => {
    if (selected.includes(index)) {
      setSelected((previous) => previous.filter((tileIndex) => tileIndex !== index));
      flashTile(`tile-${index}`);
    } else if (title.length < count) {
      flashTile(`tile-${index}`, undefined, '#4f46e5');
      setSelected((previous) => [...previous, index]);
    }
  }, [count, selected, title]);

  const handleBackspace = useCallback(() => {
    flashTile('backspace');
    setSelected((previous) => previous.slice(0, -1));
  }, []);

  const handleEnter = useCallback(() => {
    flashTile('enter');
    const wordValue = getWordValue(title);

    if (title.length >= 3 && dictionaryUtils(title)) {
      if (gameState) {
        setHealth((previous) => Math.min(previous + wordValue, MAX_HEALTH));
        setScore((previous) => previous + wordValue);
        setWordList((previous) => [...previous, {word: title, value: wordValue}]);
        
        if (wordValue >= 6) {
          setDecrement((previous) => Math.max(previous - wordValue / 100, 0.1));
        }
      }

      selected.forEach((index) => flashTile(`tile-${index}`, '#22c55e'));
      shakeScreen(wordValue >= 4 ? wordValue : 0);
      setHealthIncrease(wordValue + Math.random() * 0.01);
      setLetters((previous) => previous.map((letter, index) => (
        selected.includes(index) ? fetchLetter() : letter
      )));
    } else {
      selected.forEach((index) => flashTile(`tile-${index}`, '#ef4444'));
    }

    setSelected([]);
  }, [gameState, selected, title]);

  const handleShuffle = useCallback(() => {
    flashTile('shuffle');
    resetBag();
    setLetters((previous) => previous.map((letter, index) => {
      flashTile(`tile-${index}`);
      return fetchLetter();
    }));
    setSelected([]);
    if (gameState === true) {
      setHealthDecrease(shufflePenalty);
      setHealth((previous) => Math.max(previous - shufflePenalty, 0));
      setShufflePenalty((previous) => previous + 3);
    }
  }, [gameState, shufflePenalty]);

  const startGame = () => {
    resetBag();
    setLetters((previous) => previous.map((letter, index) => {
      flashTile(`tile-${index}`);
      return fetchLetter();
    }));
    setSelected([]);
    setTitle('');
    elapsedTimeRef.current = 0;
    setGameTime(0);
    setGameState(true);
    setHealth(MAX_HEALTH / 2);
    setDecrement(INITIAL_DECREMENT);
    setShufflePenalty(5);
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
          previous + TICK_RATE / 120000,
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
        endGame();
      } else {
        let index = letters.indexOf(pressedKey);
        while (index !== -1 && selected.includes(index)) {
          index = letters.indexOf(pressedKey, index + 1);
        }
        if (index !== -1) {
          handleLetter(letters[index], index);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [count, endGame, gameState, handleBackspace, handleEnter, handleLetter, handleShuffle, letters, selected, title]);

  return {
    count,
    endGame,
    gameState,
    gameTime,
    handleBackspace,
    handleEnter,
    handleLetter,
    handleShuffle,
    health,
    healthIncrease,
    healthDecrease,
    decrement,
    shufflePenalty,
    letters,
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
