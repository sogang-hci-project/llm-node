import { NextFunction, Request, Response } from "express";

import { chainInitializer, ongoingQAPrompt, doneNoQAPrompt, ongoingNoQAPrompt, doneQAPrompt, redisClient } from "~/lib";

interface IMapDialogue {
  human: string;
  ai: string;
  id: number;
}

function mapDialogue({ human, ai, id }: IMapDialogue) {
  const dialogueBlock = [];
  if (human.length !== 0) dialogueBlock.push(`Participant: ${human}`);
  if (ai.length !== 0) dialogueBlock.push(`Pablo Picasso: ${ai}`);

  return dialogueBlock.join("\n");
}

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, sessionID, additional, done } = req.body;

    if (!user || !sessionID) return res.status(400).json({ message: "incorrect LLM data" });
    const context = JSON.parse(await redisClient.get(sessionID)) || [];
    const chat = { id: context.length + 1, human: user, ai: "" };
    context.push(chat);
    const dialogueContext = context.map(mapDialogue).join("\n");

    let query;
    if (done) {
      query = `[INSTRUCTION]: ${
        additional ? doneQAPrompt : doneNoQAPrompt
      } \n [DIALOGUE]: \n ${dialogueContext} \n Pablo Picasso:`;
    } else {
      query = `[INSTRUCTION]: ${
        additional ? ongoingQAPrompt : ongoingNoQAPrompt
      } \n [DIALOGUE]: \n ${dialogueContext} \n Pablo Picasso:`;
    }

    const chain = await chainInitializer({ free: false });
    const result = await chain.call({
      query,
    });
    const { text } = result;
    context[context.length - 1]["ai"] = text;

    await redisClient.set(sessionID, JSON.stringify(context));

    // split() method를 사용하여 문장 분리
    const delimiter = "(Question)";
    const textParts = text.split(delimiter);
    const [answer, quiz] = textParts.map((part: string) => part.trim());

    res.status(200).json({ message: "Structured Model Success", text: "", answer, quiz });
  } catch (e) {
    next(e);
  }
};

export const handleChatWithFree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chain = await chainInitializer({ free: true });
    const { user, sessionID } = req.body;
    if (!user || !sessionID) return res.status(400).json({ message: "incorrect LLM data" });

    const context = JSON.parse(await redisClient.get(sessionID)) || [];
    const chat = { id: context.length + 1, human: user, ai: "" };
    context.push(chat);

    const dialogueContext = context.map(mapDialogue).join(" \n ");

    const result = await chain.call({ message: "[DIALOGUE]" + dialogueContext + "\n Pablo Picasso:" });
    const { text } = result;

    context[context.length - 1]["ai"] = text;

    await redisClient.set(sessionID, JSON.stringify(context));
    res.status(200).json({ message: "Free Model Success", text });
  } catch (e) {
    next(e);
  }
};
