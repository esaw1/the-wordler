const dictionary = new Set();

export const loadDictionary = async () => {
  if (dictionary.size === 0) {
    try {
      const response = await fetch('/the-wordler/words/dictionary.json');
      const words = await response.json();

      words.forEach((word) => dictionary.add(word));
      console.log('Dictionary populated with', dictionary.size, 'words.');
    } catch (error) {
      console.error('Error loading words:', error);
    }
  }
};

export const dictionaryUtils = (word) => {
  return dictionary.has(word.toLowerCase());
}

export const randomWord = () => {
  const wordsArray = Array.from(dictionary);
  const randomIndex = Math.floor(Math.random() * wordsArray.length);
  return wordsArray[randomIndex];
};
