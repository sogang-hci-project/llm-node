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
Object.defineProperty(exports, "__esModule", { value: true });
const hnswlib_1 = require("langchain/vectorstores/hnswlib");
const openai_1 = require("langchain/embeddings/openai");
const constants_1 = require("./constants");
const env_1 = require("./constants/env");
/**
 * Load the vector store from the DATA_STORE_PATH
 * @returns vector db
 */
function loadVectorStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const loadedVectorStore = yield hnswlib_1.HNSWLib.load(constants_1.DATA_STORE_PATH, new openai_1.OpenAIEmbeddings({ openAIApiKey: env_1.openAIApiKey }));
        return loadedVectorStore;
    });
}
exports.default = loadVectorStore;
