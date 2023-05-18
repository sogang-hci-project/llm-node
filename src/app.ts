import { SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate } from "langchain/prompts";
import { RetrievalQAChain } from "langchain/chains";
import dotenv from "dotenv";
import { OpenAI } from "langchain/llms/openai";

import loadVectorStore from "./load.local.db";
import { openAIApiKey } from "./constants";
dotenv.config();

const model = new OpenAI({
  streaming: true,
  openAIApiKey,
  temperature: 0.9,
  callbacks: [
    {
      handleLLMNewToken(token: string) {
        process.stdout.write(token);
      },
    },
  ],
});

const messages = [
  SystemMessagePromptTemplate.fromTemplate(
    "You are a helpful assistant that translates {input_language} to {output_language}."
  ),
  HumanMessagePromptTemplate.fromTemplate("{text}"),
];
const prompt = ChatPromptTemplate.fromPromptMessages(messages);

async function initializer() {
  const vectorStore = await loadVectorStore();

  // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const contents = await chain.call({
    query: "who am i?",
  });
  console.log({ contents });
}
initializer();
