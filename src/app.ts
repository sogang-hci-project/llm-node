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
  const question = "what is vts sesssion?";
  const res = await chain.call({ question, chat_history: [] });
  console.log(res);

  // follow up question
  let chatHistory = question + res.text;
  const followUpRes = await chain.call({
    question: `which country picasso was born? play role of picasso and answer it and please make two quiz within out context.
    this quiz must use within contents you explain me so i can answer it if only i could remember them.
    please use below format when you create quiz.
    "QUIZ1":"quiz1 contents"
    "QUIZ2":"quiz2 contensts"
    `,
    chat_history: chatHistory,
  });
  chatHistory = question + res.text + followUpRes.text;
  const followUpRes2 = await chain.call({
    question: `which country picasso was born? play role of picasso and answer it`,
    chat_history: chatHistory,
  });
  console.log(followUpRes2);
}
initializer();
