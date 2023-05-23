import { ConversationalRetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";

import loadVectorStore from "./load.local.db";
import { openAIApiKey } from "./constants";

const model = new ChatOpenAI({
  temperature: 0.9,
  openAIApiKey,
  streaming: true,
  callbacks: [
    {
      handleLLMNewToken(token: string) {
        process.stdout.write(token);
      },
    },
  ],
});

async function initializer() {
  const vectorStore = await loadVectorStore();
  const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const question = "who is picasso? play role of picasso and answer it";
  const res = await chain.call({ question, chat_history: [] });
  console.log(res);

  // follow up question
  // let chatHistory = question + res.text;
  // const followUpRes = await chain.call({
  //   question: "who supported sogang-hci?",
  //   chat_history: chatHistory,
  // });
}
initializer();
