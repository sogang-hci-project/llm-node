import { NextFunction, Request, Response } from "express";

import { chainInitializer, redisClient } from "~/lib";

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, sessionId } = req.body;
    if (!user || !sessionId) return res.status(400).json({ message: "incorrect LLM data" });
    let context = await redisClient.get(sessionId);
    if (!context) context = `context:`;
    const chain = await chainInitializer({ free: false });
    const question = `${user}`;
    const result = await chain.call({ question, chat_history: [context] });
    console.log("\n🔥🔥🔥 result", result);
    const { text } = result;
    res.status(200).json({ message: "llm model router test", text });
  } catch (e) {
    next(e);
  }
};

export const handleChatWithFree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chain = await chainInitializer({ free: true });
    const { user, sessionId } = req.body;
    if (!user || !sessionId) return res.status(400).json({ message: "incorrect LLM data" });
    let context = await redisClient.get(sessionId);
    if (!context) context = `context: `;
    context += `\n${user}`;
    const result = await chain.call({ user: context });
    const { text } = result;
    context += `\n ${text}`;
    redisClient.set(sessionId, context);
    res.status(200).json({ message: "테스트 중", text });
  } catch (e) {
    next(e);
  }
};

/**
 * router for prompt test
 */
export const test = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chain = await chainInitializer({ free: true });
    const res2 = await chain.call({ user: `I'm an Siwon Jeon. Please introduce yourself.` });
    const { text } = res2;
    console.log(res2);
    res.status(200).json({ message: "테스트 중1", text });
  } catch (e) {
    next(e);
  }
};
