import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

import { openAIApiKey } from "~/constants";
import loadVectorStore from "~/load.local.db";

export const model = new ChatOpenAI({
  temperature: 0,
  openAIApiKey,
  verbose: false,
  streaming: true,
  callbacks: [
    {
      handleLLMNewToken(token: string) {
        process.stdout.write(token);
      },
    },
  ],
});

const template = `This is a role-playing situation. Put yourself in the shoes of the painter Pablo Picasso. Speak once and wait for the next answer.
I've put all of our previous conversations in a place called "context:", so if there's something you don't recognize, please refer to that and answer. 
{user}`;

export const dbTemplate = `This is a role-playing situation and you're going to answer as the painter Pablo Picasso.
"context:" has a history of previous conversations,
so if there's something you don't know, use the "context:" if you don't understand something.
This conversation is about a painting called Guernica by Pablo Picasso.
Summarize and restate what the user said and include them in the answer in the format:"Answer:" 
then create a one quiz related to the answer, and wait for the next user to answer.
include Quiz in the answer in the format: "Quiz: ",
`;
export const dbTemplateNoQuiz = `This is a role-playing situation and you're going to answer as the painter Pablo Picasso.
"context:" has a history of previous conversations,
so if there's something you don't know, use the "context:" if you don't understand something.
This conversation is about a painting called Guernica by Pablo Picasso.
Summarize and restate what the user said and include them in the answer in the format:"Answer:" 
Don't ask if there are any additional questions.
`;

export async function chainInitializer({ free }: { free: boolean }) {
  const vectorStore = await loadVectorStore();
  let chain;
  if (free) {
    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["user"],
    });
    chain = new LLMChain({ llm: model, prompt: prompt });
  } else {
    chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  }
  return chain;
}
