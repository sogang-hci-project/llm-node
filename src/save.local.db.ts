import fs from "fs";
import { extname, join } from "path";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { openAIApiKey } from "./constants/env";

const folderPath = `${__dirname}/static/markdown`;

function getAllMarkDownFiles(folderPath: string) {
  const files = fs.readdirSync(folderPath);
  /**
   * check if other files exist with no .md extenstion
   */
  const jsonFiles = files.filter((file: string) => extname(file) === ".md");
  const filePaths = jsonFiles.map((file: string) => join(folderPath, file));
  return filePaths;
}

const filePaths = getAllMarkDownFiles(folderPath);

/**
 * load documents from markdown files and create Document instance
 * save local vector in DATA_STORE path for resuing vector db with static markdown files
 *
 * @returns splited text can be insedted into vector database
 */

const init = async () => {
  const documents: any = [];
  await Promise.all(
    filePaths.map(async (file: string) => {
      const text = fs.readFileSync(file, "utf-8");
      const regex = /\/llm-node(.*)/;
      const relativePath = file.match(regex)[1];
      documents.push(new Document({ pageContent: text, metadata: { source: relativePath } }));
    })
  );

  const textSplitter = new CharacterTextSplitter({
    separator: "\n#",
    chunkSize: 50,
    chunkOverlap: 3,
  });

  const splitedText = await textSplitter.splitDocuments(documents);

  //create vector database using documents and save to DATA_STORE_PATH
  const vectorStore = await HNSWLib.fromDocuments(splitedText, new OpenAIEmbeddings({ openAIApiKey }));
  const DATA_STORE_PATH = "data_store";
  await vectorStore.save(DATA_STORE_PATH);
};

init();
