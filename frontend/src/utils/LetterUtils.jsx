// Currently using Scrabble frequencies
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

const letterList = [];

for (let i = 0; i < amountList.length; i++) {
  for (let j = 0; j < amountList[i].letters.length; j++) {
    for (let k = 0; k < amountList[i].amount; k++) {
      letterList.push(amountList[i].letters[j]);
    }
  }
}

const consonants = [
  'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
];

export const fetchLetter = (letters) => {
  const numVowels = letters.filter(letter => !consonants.includes(letter)).length;
  return letterList[Math.floor(Math.random() * letterList.length)];
}