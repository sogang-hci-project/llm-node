import fs from "fs";

const filePath = `${__dirname}/../static/markdown/vts.md`;
const result = fs.readFileSync(filePath).toString();
addHashesAndReturnLongestSentenceLength(result);

/**
 * add # front of sentence and rewrite that text
 * then returns sentences of max length in that md file
 * @param mdText
 * @returns
 */

export function addHashesAndReturnLongestSentenceLength(mdText: string) {
  const sentences = mdText.trim().split(/[.!?]+/);

  let longestLength = 0;

  const modifiedSentences = sentences.map((sentence: string) => {
    sentence = sentence.trim();
    if (sentence.length > 0) {
      longestLength = Math.max(longestLength, sentence.length);
      return `#${sentence}.`;
    }
    return sentence;
  });

  const revisedSentences: string = modifiedSentences.join(" ");
  fs.writeFile(filePath, revisedSentences, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${filePath} : created add # `);
  });
  console.log("가장 긴 문장의 길이", longestLength);
  return longestLength;
}
