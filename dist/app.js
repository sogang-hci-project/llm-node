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
const chains_1 = require("langchain/chains");
const openai_1 = require("langchain/chat_models/openai");
const load_local_db_1 = __importDefault(require("./load.local.db"));
const constants_1 = require("./constants");
const model = new openai_1.ChatOpenAI({
    temperature: 0.9,
    openAIApiKey: constants_1.openAIApiKey,
    streaming: true,
    callbacks: [
        {
            handleLLMNewToken(token) {
                process.stdout.write(token);
            },
        },
    ],
});
function initializer() {
    return __awaiter(this, void 0, void 0, function* () {
        const vectorStore = yield (0, load_local_db_1.default)();
        const chain = chains_1.ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
        const question = "who is participants of sogang hci?";
        const res = yield chain.call({ question, chat_history: [] });
        console.log(res);
        // follow up question
        // let chatHistory = question + res.text;
        // const followUpRes = await chain.call({
        //   question: "who supported sogang-hci?",
        //   chat_history: chatHistory,
        // });
    });
}
initializer();
