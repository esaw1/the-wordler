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
  const letterList = [];
  for (let i = 0; i < amountList.length; i++) {
    for (let j = 0; j < amountList[i].letters.length; j++) {
      for (let k = 0; k < amountList[i].amount; k++) {
        letterList.push(amountList[i].letters[j]);
      }
    }
  }
  for (let i = letterList.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [letterList[i], letterList[randomIndex]] = [letterList[randomIndex], letterList[i]];
  }
  return letterList;
};

let currentBag = generateBag();

export const fetchLetter = () => {
  if (currentBag.length === 0.0) {
    currentBag = generateBag();
  }
  return currentBag.pop();
}