// Currently using Scrabble frequencies & Tetris bag system
const amountList = [
  { amount: 12, letters: ['E'] },
  { amount: 9,  letters: ['A', 'I'] },
  { amount: 8,  letters: ['O'] },
  { amount: 6,  letters: ['N', 'R', 'T'] },
  { amount: 4,  letters: ['L', 'S', 'U', 'D'] },
  { amount: 3,  letters: ['G'] },
  { amount: 2,  letters: ['B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y'] },
  { amount: 1,  letters: ['K', 'J', 'X', 'Q', 'Z'] }
];

const generateBag = () => {
  const letterBag = [];
  for (let i = 0; i < amountList.length; i++) {
    for (let j = 0; j < amountList[i].letters.length; j++) {
      for (let k = 0; k < amountList[i].amount; k++) {
        letterBag.push(amountList[i].letters[j]);
      }
    }
  }
  for (let i = letterBag.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [letterBag[i], letterBag[randomIndex]] = [letterBag[randomIndex], letterBag[i]];
  }
  return letterBag;
};

let currentBag = generateBag();

export const resetBag = () => {
  currentBag = generateBag();
}

export const fetchLetter = () => {
  if (currentBag.length === 0.0) {
    currentBag = generateBag();
  }
  return currentBag.pop();
}

const letterVals = [
  // Bookworm weights * 4
  /*
  { weight: 4, letters: ['A', 'D', 'E', 'G', 'I', 'L', 'N', 'O', 'R', 'S', 'T', 'U']},
  { weight: 5, letters: ['B', 'C', 'F', 'H', 'M', 'P']},
  { weight: 6, letters: ['V', 'W', 'Y']},
  { weight: 7, letters: ['J', 'K', 'Q']},
  { weight: 8, letters: ['X', 'Z']},
   */

  // Scrabble weights
  { weight: 1, letters: ["A", "E", "I", "O", "U", "L", "N", "S", "T", "R"] },
  { weight: 2, letters: ["D", "G"] },
  { weight: 3, letters: ["B", "C", "M", "P"] },
  { weight: 4, letters: ["F", "H", "V", "W", "Y"] },
  { weight: 5, letters: ["K"] },
  { weight: 8, letters: ["J", "X"] },
  { weight: 10, letters: ["Q", "Z"] }
]

export const getLetterValue = (letter) => {
  for (const group of letterVals) {
    if (group.letters.includes(letter)) {
      return group.weight;
    }
  }
  return -1;
}

export const getWordValue = (word) => {
  return word
    .split('')
    .map((c) => getLetterValue(c))
    .reduce((a,b) => a + b, 0);
}