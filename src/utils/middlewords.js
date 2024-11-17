export const getMiddleWords = (text, numWords = 100) => {
    const words = text.split(' ');
    const middleIndex = Math.floor(words.length / 2);
    const start = Math.max(middleIndex - Math.floor(numWords / 2), 0);
    const end = Math.min(middleIndex + Math.ceil(numWords / 2), words.length);
    return words.slice(start, end).join(' ');
}