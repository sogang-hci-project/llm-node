import { NextFunction, Request, Response } from "express";

import { chainInitializer, redisClient } from "~/lib";

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, sessionId } = req.body;
    if (!user || !sessionId) return res.status(400).json({ message: "incorrect LLM data" });
    let context = await redisClient.get(sessionId);
    if (!context) {
      redisClient.set(sessionId, "context init\n");
      context = "context init\n";
    }

    const chain = await chainInitializer({ free: false });
    const question = user;
    const result = await chain.call({ question, chat_history: [] });
    redisClient.set(
      sessionId,
      `${context}\n{
      user: ${user}
      agent: ${result.text}
    }`
    );
    const { text } = result;

    res.status(200).json({ message: "llm model router test", text });
  } catch (e) {
    next(e);
  }
};
