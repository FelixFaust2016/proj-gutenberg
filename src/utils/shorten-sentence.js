export const shortenSentence = (sentence, maxLength) => {
    const words = sentence.split(" ");
  if (words.length <= maxLength) return sentence;
  return `${words.slice(0, maxLength).join(" ")}...`;
  };