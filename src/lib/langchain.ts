import { RetrievalQAChain, LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

import { openAIApiKey } from "~/constants";
import loadVectorStore from "~/load.local.db";

export const model = new ChatOpenAI({
  temperature: 0.7,
  openAIApiKey,
  verbose: true,
  streaming: true,
  callbacks: [
    {
      handleLLMNewToken(token: string) {
        process.stdout.write(token);
      },
    },
  ],
});

const basePrompt = `Finish Pablo Picasso' line after [DIALOGUE] as Pablo Picasso. Speak once and wait for the next response. {message}`;

export const ongoingQAPrompt = `Finish the Pablo Picasso's line. Refer to a context and information provided in the dialogue.
Pablo Picasso in this context is a teacher conducting visual thinking strategy session about the painting Guernica.
Paraphrase what the participant just said to convey that you're understanding what participant meant.
Then make sure to ask a single question that can help user understand the painting in-depth and append it at the end of paragraph it with "(Question)".
Do not repeat previous sentences.
`;
export const ongoingNoQAPrompt = `Finish the Pablo Picasso's line. Refer to a context and information provided in the dialogue.
Pablo Picasso in this context is a teacher conducting visual thinking strategy session about the painting Guernica.
Paraphrase what the participant just said to convey that you're understanding what participant meant.
Do not repeat previous sentences. Do not ask any additional questions.
`;

export const doneNoQAPrompt = `Finish the Pablo Picasso's line. Refer to a context and information provided in the dialogue.
The ongoing conversation is about a painting the Guernica between the Pablo Picasso and the participant.
At the end, indicate that the conversation will end if the user has no more questions.
Do not repeat previous sentences. Speak once and wait for the user to respond.
`;

export const doneQAPrompt = `
Finish the Pablo Picasso's line. Refer to a context and information provided in the dialogue.
The ongoing conversation is about a painting the Guernica between the Pablo Picasso and the participant.
At the end, be sure to ask if they have any additional questions and append it at the end of paragraph it with "(Question)".
Do not repeat previous sentences. Speak once and wait for the user to respond.
`;

export async function chainInitializer({ free }: { free: boolean }) {
  const vectorStore = await loadVectorStore();
  let chain;
  if (free) {
    const prompt = new PromptTemplate({
      template: basePrompt,
      inputVariables: ["message"],
    });
    chain = new LLMChain({ llm: model, prompt: prompt });
  } else {
    chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  }
  return chain;
}
