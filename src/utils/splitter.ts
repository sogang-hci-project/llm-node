import fs from "fs";
import { folderPath, getAllMarkDownFiles } from "~/save.local.db";

const filePaths = getAllMarkDownFiles(folderPath);
addHashesAndReturnLongestSentenceLength(filePaths);

/**
 * add # front of sentence and rewrite that text
 * then returns sentences of max length in that md file
 * @param mdText
 * @returns
 */

export function addHashesAndReturnLongestSentenceLength(filePaths: string[]) {
  filePaths.map((filePath: string) => {
    const mdText = fs.readFileSync(filePath).toString();

    // const sentences = mdText.trim().split(/[.!?]+/);

    // len 100자씩 자르기
    let length = 100;
    var sentences = [];
    for (let i = 0; i < mdText.length; i += length) {
      sentences.push(mdText.substring(i, i + length));
    }

    const modifiedSentences = sentences.map((sentence: string) => {
      sentence = sentence.trim();
      if (sentence.length > 0) {
        return `##${sentence}.`;
      }
      return sentence;
    });

    const revisedSentences: string = modifiedSentences.join(" ");
    fs.writeFile(filePath, revisedSentences, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${filePath} : created add ##`);
    });
  });
}
