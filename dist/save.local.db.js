"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const text_splitter_1 = require("langchain/text_splitter");
const document_1 = require("langchain/document");
const hnswlib_1 = require("langchain/vectorstores/hnswlib");
const openai_1 = require("langchain/embeddings/openai");
const env_1 = require("./constants/env");
const constants_1 = require("./constants");
const folderPath = `${__dirname}/static/markdown`;
function getAllMarkDownFiles(folderPath) {
    let filePaths = [];
    function traverseFolder(currentPath) {
        const files = fs_1.default.readdirSync(currentPath);
        files.forEach((file) => {
            const filePath = path_1.default.join(currentPath, file);
            const fileStat = fs_1.default.statSync(filePath);
            if (fileStat.isDirectory()) {
                traverseFolder(filePath); // 재귀적으로 하위 폴더 탐색
            }
            else if (path_1.default.extname(file) === ".md") {
                filePaths.push(filePath); // .md 파일인 경우 경로 추가
            }
        });
    }
    traverseFolder(folderPath); // 최상위 폴더부터 시작하여 모든 하위 폴더 탐색
    return filePaths;
}
const filePaths = getAllMarkDownFiles(folderPath);
/**
 * Save vector db in DATA_STORE path for resuing vector db with static markdown files
 */
const saveVectorDatabaseIntoLocalPath = () => __awaiter(void 0, void 0, void 0, function* () {
    const documents = [];
    yield Promise.all(filePaths.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const text = fs_1.default.readFileSync(file, "utf-8");
        const regex = /\/llm-node(.*)/;
        const relativePath = file.match(regex)[1];
        documents.push(new document_1.Document({ pageContent: text, metadata: { source: relativePath } }));
    })));
    const textSplitter = new text_splitter_1.CharacterTextSplitter({
        separator: "\n#",
        chunkSize: 102,
        chunkOverlap: 2,
    });
    const splitedText = yield textSplitter.splitDocuments(documents);
    //create vector database using documents and save to DATA_STORE_PATH
    const vectorStore = yield hnswlib_1.HNSWLib.fromDocuments(splitedText, new openai_1.OpenAIEmbeddings({ openAIApiKey: env_1.openAIApiKey }));
    yield vectorStore.save(constants_1.DATA_STORE_PATH);
});
saveVectorDatabaseIntoLocalPath();
